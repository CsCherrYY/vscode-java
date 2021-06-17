import * as vscode from "vscode";
import { Position, TextDocumentIdentifier } from "vscode-languageclient";
import { LanguageClient } from "vscode-languageclient/node";
import { getActiveLanguageClient } from "../extension";
import { PrepareTypeHierarchy, TypeHierarchyItemCode, TypeHierarchyItemLSP, TypeHierarchyPrepareParams, TypeHierarchyView } from "../protocol";
import { showNoLocationFound } from "../standardLanguageClient";
import { ClassHierarchyTreeInput } from "./classHierarchyModel";
import { TypeHierarchyTreeInput } from "./model";
import { SymbolTree } from "./references-view";
import { ToTypeHierarchyItemCode } from "./util";

export class TypeHierarchyTree {
	private api: SymbolTree;
	private view: TypeHierarchyView;
	private client: LanguageClient;
	private cancelTokenSource: vscode.CancellationTokenSource;
	private location: vscode.Location;
	private baseItem: TypeHierarchyItemCode;
	public initialized: boolean;

	constructor() {
		this.initialized = false;
	}

	public async initialize() {
		this.api = await vscode.extensions.getExtension<SymbolTree>('ms-vscode.references-view').activate();
		this.client = await getActiveLanguageClient();
		this.initialized = true;
	}

	public async setTypeHierarchy(location: vscode.Location): Promise<void> {
		if (!this.initialized) {
			await this.initialize();
		}
		if (!this.api) {
			return;
		}
		if (this.cancelTokenSource) {
			this.cancelTokenSource.cancel();
		}
		this.cancelTokenSource = new vscode.CancellationTokenSource();
		const textDocument: TextDocumentIdentifier = TextDocumentIdentifier.create(location.uri.toString());
		const position: Position = Position.create(location.range.start.line, location.range.start.character);
		const params: TypeHierarchyPrepareParams = {
			textDocument: textDocument,
			position: position,
		};
		let lspItem: TypeHierarchyItemLSP;
		try {
			const prepareResults = await this.client.sendRequest(PrepareTypeHierarchy.type, params, this.cancelTokenSource.token);
			if (!prepareResults) {
				showNoLocationFound('No Type Hierarchy found');
				return;
			}
			lspItem = prepareResults[0];
		} catch (e) {
			// operation cancelled
			return;
		}
		const symbolKind = this.client.protocol2CodeConverter.asSymbolKind(lspItem.kind);
		const view: TypeHierarchyView = (symbolKind === vscode.SymbolKind.Interface) ? TypeHierarchyView.Subtype : TypeHierarchyView.Class;
		const item: TypeHierarchyItemCode = ToTypeHierarchyItemCode(this.client, lspItem);
		const input = (view === TypeHierarchyView.Class) ? new ClassHierarchyTreeInput(location, this.cancelTokenSource.token, item) : new TypeHierarchyTreeInput(location, view, this.cancelTokenSource.token, item);
		this.location = location;
		this.view = view;
		this.baseItem = item;
		this.api.setInput(input);
	}

	public changeView(view: TypeHierarchyView): void {
		if (!this.api) {
			return;
		}
		if (this.cancelTokenSource) {
			this.cancelTokenSource.cancel();
		}
		this.cancelTokenSource = new vscode.CancellationTokenSource();
		const input = (view === TypeHierarchyView.Class) ? new ClassHierarchyTreeInput(this.location, this.cancelTokenSource.token, this.baseItem) : new TypeHierarchyTreeInput(this.location, view, this.cancelTokenSource.token, this.baseItem);
		this.view = view;
		this.api.setInput(input);
	}

	public async changeBaseItem(item: TypeHierarchyItemCode): Promise<void> {
		if (!this.api) {
			return;
		}
		if (this.cancelTokenSource) {
			this.cancelTokenSource.cancel();
		}
		this.cancelTokenSource = new vscode.CancellationTokenSource();
		const location: vscode.Location = new vscode.Location(vscode.Uri.parse(item.uri), item.selectionRange);
		const newLocation: vscode.Location = (await this.isValidRequestPosition(location.uri, location.range.start)) ? location : this.location;
		const input = (this.view === TypeHierarchyView.Class) ? new ClassHierarchyTreeInput(newLocation, this.cancelTokenSource.token, item) : new TypeHierarchyTreeInput(newLocation, this.view, this.cancelTokenSource.token, item);
		this.location = newLocation;
		this.baseItem = item;
		this.api.setInput(input);
	}

	private async isValidRequestPosition(uri: vscode.Uri, position: vscode.Position) {
		const doc = await vscode.workspace.openTextDocument(uri);
		let range = doc.getWordRangeAtPosition(position);
		if (!range) {
			range = doc.getWordRangeAtPosition(position, /[^\s]+/);
		}
		return Boolean(range);
	}
}

export const typeHierarchyTree: TypeHierarchyTree = new TypeHierarchyTree();
