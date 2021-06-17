import * as vscode from "vscode";
import { SymbolItemNavigation, SymbolTreeInput, SymbolTreeModel } from "./references-view";
import { getActiveLanguageClient } from "../extension";
import { LanguageClient } from "vscode-languageclient/node";
import { typeHierarchyViewToContextString } from "./util";
import { TypeHierarchyView, TypeHierarchyItemCode } from "../protocol";
import { typeHierarchyRepository } from "./typeHierarchyRepository";

export class TypeHierarchyTreeInput implements SymbolTreeInput<TypeHierarchyItemCode> {
	readonly contextValue: string = "javaTypeHierarchy";
	readonly title: string;
	readonly rootItem: TypeHierarchyItemCode;
	private client: LanguageClient;

	constructor(readonly location: vscode.Location, readonly view: TypeHierarchyView, readonly token: vscode.CancellationToken, item: TypeHierarchyItemCode) {
		typeHierarchyRepository.clear();
		this.rootItem = item;
		switch (view) {
			case TypeHierarchyView.Supertype:
				this.title = "Supertype Hierarchy";
				break;
			case TypeHierarchyView.Subtype:
				this.title = "Subtype Hierarchy";
				break;
			default:
				return;
		}
	}

	async resolve(): Promise<SymbolTreeModel<TypeHierarchyItemCode>> {
		if (!this.client) {
			this.client = await getActiveLanguageClient();
		}
		// workaround: await a second to make sure the success of reveal operation on baseItem, see: https://github.com/microsoft/vscode/issues/114989
		await new Promise((resolve) => setTimeout(resolve, 1000));
		const model: TypeHierarchyModel = new TypeHierarchyModel(this.rootItem, this.view);
		const provider = new TypeHierarchyTreeDataProvider(model, this.client, this.token);
		const treeModel: SymbolTreeModel<TypeHierarchyItemCode> = {
			provider: provider,
			message: undefined,
			navigation: model,
			dispose() {
				provider.dispose();
			}
		};
		vscode.commands.executeCommand('setContext', 'typeHierarchyView', typeHierarchyViewToContextString(this.view));
		vscode.commands.executeCommand('setContext', 'typeHierarchySymbolKind', this.rootItem.kind);
		return treeModel;
	}

	with(location: vscode.Location): TypeHierarchyTreeInput {
		return new TypeHierarchyTreeInput(location, this.view, this.token, this.rootItem);
	}
}

export class TypeHierarchyModel implements SymbolItemNavigation<TypeHierarchyItemCode> {
	public readonly onDidChange = new vscode.EventEmitter<TypeHierarchyModel>();
	public readonly onDidChangeEvent = this.onDidChange.event;

	constructor(private rootItem: TypeHierarchyItemCode, private view: TypeHierarchyView) { }

	public getRootItem(): TypeHierarchyItemCode {
		return this.rootItem;
	}

	public getView(): TypeHierarchyView {
		return this.view;
	}

	location(item: TypeHierarchyItemCode) {
		return new vscode.Location(vscode.Uri.file(item.uri), item.range);
	}

	nearest(_uri: vscode.Uri, _position: vscode.Position): TypeHierarchyItemCode | undefined {
		return this.rootItem;
	}

	next(from: TypeHierarchyItemCode): TypeHierarchyItemCode {
		return from;
	}

	previous(from: TypeHierarchyItemCode): TypeHierarchyItemCode {
		return from;
	}
}

class TypeHierarchyTreeDataProvider implements vscode.TreeDataProvider<TypeHierarchyItemCode> {
	private readonly _emitter: vscode.EventEmitter<TypeHierarchyItemCode> = new vscode.EventEmitter<TypeHierarchyItemCode>();
	private readonly _modelListener: vscode.Disposable;
	public readonly onDidChangeTreeData: vscode.Event<TypeHierarchyItemCode> = this._emitter.event;

	constructor(readonly model: TypeHierarchyModel, readonly client: LanguageClient, readonly token: vscode.CancellationToken) {
		this._modelListener = model.onDidChangeEvent(e => this._emitter.fire(undefined));
	}

	dispose(): void {
		this._emitter.dispose();
		this._modelListener.dispose();
	}

	async getTreeItem(element: TypeHierarchyItemCode): Promise<vscode.TreeItem> {
		if (!element) {
			return undefined;
		}
		const treeItem: vscode.TreeItem = (element === this.model.getRootItem()) ? new vscode.TreeItem({ label: element.name, highlights: [[0, element.name.length]] }) : new vscode.TreeItem(element.name);
		treeItem.contextValue = (element === this.model.getRootItem() || !element.uri) ? "false" : "true";
		treeItem.description = element.detail;
		treeItem.iconPath = TypeHierarchyTreeDataProvider.getThemeIcon(element.kind);
		treeItem.command = (element.uri) ? {
			command: 'vscode.open',
			title: 'Open Type Definition Location',
			arguments: [
				vscode.Uri.parse(element.uri), <vscode.TextDocumentShowOptions>{ selection: element.selectionRange }
			]
		} : undefined;
		// workaround: set a specific id to refresh the collapsible state for treeItems, see: https://github.com/microsoft/vscode/issues/114614#issuecomment-763428052
		treeItem.id = `${element.data}${Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)}`;
		if (this.model.getView() === TypeHierarchyView.Subtype) {
			if (element === this.model.getRootItem() && !typeHierarchyRepository.isSubtypesResolved(element)) {
				treeItem.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
			} else if ((await typeHierarchyRepository.getSubtypes(element, this.token)).length > 0) {
				treeItem.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
			} else {
				treeItem.collapsibleState = vscode.TreeItemCollapsibleState.None;
			}
		} else if (this.model.getView() === TypeHierarchyView.Supertype) {
			if (element === this.model.getRootItem() && !typeHierarchyRepository.isSupertypesResolved(element)) {
				treeItem.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
			} else if ((await typeHierarchyRepository.getSupertypes(element, this.token)).length > 0) {
				treeItem.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
			} else {
				treeItem.collapsibleState = vscode.TreeItemCollapsibleState.None;
			}
		}
		return treeItem;
	}

	async getChildren(element?: TypeHierarchyItemCode | undefined): Promise<TypeHierarchyItemCode[]> {
		if (!element) {
			return [this.model.getRootItem()];
		}
		if (this.model.getView() === TypeHierarchyView.Subtype) {
			if (TypeHierarchyTreeDataProvider.isWhiteListType(element)) {
				return [TypeHierarchyTreeDataProvider.getFakeItem(element)];
			}
			const subtypes = await typeHierarchyRepository.getSubtypes(element, this.token);
			if (subtypes.length === 0) {
				this._emitter.fire(element);
			}
			return subtypes;
		} else if (this.model.getView() === TypeHierarchyView.Supertype) {
			const supertypes = await typeHierarchyRepository.getSupertypes(element, this.token);
			if (supertypes.length === 0) {
				this._emitter.fire(element);
			}
			return supertypes;
		}
		return undefined;
	}

	private static isWhiteListType(item: TypeHierarchyItemCode): boolean {
		if (item.name === "Object" && item.detail === "java.lang") {
			return true;
		}
		return false;
	}

	private static getFakeItem(item: TypeHierarchyItemCode): TypeHierarchyItemCode {
		let message: string;
		if (item.name === "Object" && item.detail === "java.lang") {
			message = "All classes are subtypes of java.lang.Object.";
		}
		return {
			name: message,
			kind: undefined,
			detail: undefined,
			uri: undefined,
			range: undefined,
			selectionRange: undefined,
			data: undefined,
			tags: [],
		};
	}

	private static themeIconIds = [
		'symbol-file', 'symbol-module', 'symbol-namespace', 'symbol-package', 'symbol-class', 'symbol-method',
		'symbol-property', 'symbol-field', 'symbol-constructor', 'symbol-enum', 'symbol-interface',
		'symbol-function', 'symbol-variable', 'symbol-constant', 'symbol-string', 'symbol-number', 'symbol-boolean',
		'symbol-array', 'symbol-object', 'symbol-key', 'symbol-null', 'symbol-enum-member', 'symbol-struct',
		'symbol-event', 'symbol-operator', 'symbol-type-parameter'
	];

	private static getThemeIcon(kind: vscode.SymbolKind): vscode.ThemeIcon | undefined {
		const id = TypeHierarchyTreeDataProvider.themeIconIds[kind];
		return id ? new vscode.ThemeIcon(id) : undefined;
	}
}
