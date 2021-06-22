import * as vscode from "vscode";
import { LanguageClient } from "vscode-languageclient/node";
import { getActiveLanguageClient } from "../extension";
import { TypeHierarchyItemCode, TypeHierarchyView } from "../protocol";
import { SymbolItemNavigation, SymbolTreeInput, SymbolTreeModel } from "./references-view";
import { typeHierarchyRepository } from "./typeHierarchyRepository";
import { typeHierarchyViewToContextString } from "./util";

export class ClassHierarchyTreeInput implements SymbolTreeInput<TypeHierarchyItemCode> {
	readonly contextValue: string = "javaTypeHierarchy";
	readonly title: string = "Class Hierarchy";
	readonly baseItem: TypeHierarchyItemCode;
	private rootItem: TypeHierarchyItemCode;

	constructor(readonly location: vscode.Location, readonly token: vscode.CancellationToken, item: TypeHierarchyItemCode) {
		typeHierarchyRepository.clear();
		this.rootItem = item;
		this.baseItem = item;
	}

	async resolve(): Promise<SymbolTreeModel<TypeHierarchyItemCode>> {
		// workaround: await a second to make sure the success of reveal operation on baseItem, see: https://github.com/microsoft/vscode/issues/114989
		await new Promise((resolve) => setTimeout(resolve, 1000));
		this.rootItem = await getRootItem(this.baseItem, this.token);
		const navigation: ClassHierarchyNavigation = new ClassHierarchyNavigation(this.rootItem, this.baseItem);
		const provider = new ClassHierarchyTreeDataProvider(navigation, this.token);
		const treeModel: SymbolTreeModel<TypeHierarchyItemCode> = {
			provider: provider,
			message: undefined,
			navigation: navigation,
			dispose() {
				provider.dispose();
			}
		};
		vscode.commands.executeCommand('setContext', 'typeHierarchyView', typeHierarchyViewToContextString(TypeHierarchyView.Class));
		vscode.commands.executeCommand('setContext', 'typeHierarchySymbolKind', this.baseItem.kind);
		return treeModel;
	}

	with(location: vscode.Location): ClassHierarchyTreeInput {
		return new ClassHierarchyTreeInput(location, this.token, this.baseItem);
	}
}

export class ClassHierarchyNavigation implements SymbolItemNavigation<TypeHierarchyItemCode> {

	public readonly onDidChange = new vscode.EventEmitter<ClassHierarchyNavigation>();
	public readonly onDidChangeEvent = this.onDidChange.event;
	public readonly view = TypeHierarchyView.Class;

	constructor(private rootItem: TypeHierarchyItemCode, private baseItem: TypeHierarchyItemCode) { }

	public getBaseItem(): TypeHierarchyItemCode {
		return this.baseItem;
	}

	public getRootItem(): TypeHierarchyItemCode {
		return this.rootItem;
	}

	location(item: TypeHierarchyItemCode) {
		return new vscode.Location(vscode.Uri.file(item.uri), item.range);
	}

	nearest(uri: vscode.Uri, _position: vscode.Position): TypeHierarchyItemCode | undefined {
		return this.baseItem;
	}

	next(from: TypeHierarchyItemCode): TypeHierarchyItemCode {
		return from;
	}

	previous(from: TypeHierarchyItemCode): TypeHierarchyItemCode {
		return from;
	}
}

class ClassHierarchyTreeDataProvider implements vscode.TreeDataProvider<TypeHierarchyItemCode> {
	private readonly _emitter: vscode.EventEmitter<TypeHierarchyItemCode> = new vscode.EventEmitter<TypeHierarchyItemCode>();
	private readonly _navigationListener: vscode.Disposable;
	public readonly onDidChangeTreeData: vscode.Event<TypeHierarchyItemCode> = this._emitter.event;
	private baseTypeTraversed: boolean = false;

	constructor(readonly navigation: ClassHierarchyNavigation, readonly token: vscode.CancellationToken) {
		this._navigationListener = navigation.onDidChangeEvent(e => this._emitter.fire(undefined));
	}

	dispose(): void {
		this._emitter.dispose();
		this._navigationListener.dispose();
	}

	async getTreeItem(element: TypeHierarchyItemCode): Promise<vscode.TreeItem> {
		if (!element) {
			return undefined;
		}
		const treeItem: vscode.TreeItem = (element === this.navigation.getBaseItem()) ? new vscode.TreeItem({ label: element.name, highlights: [[0, element.name.length]] }) : new vscode.TreeItem(element.name);
		treeItem.contextValue = (element === this.navigation.getBaseItem() || !element.uri) ? "false" : "true";
		treeItem.description = element.detail;
		treeItem.iconPath = ClassHierarchyTreeDataProvider.getThemeIcon(element.kind);
		treeItem.command = (element.uri) ? {
			command: 'vscode.open',
			title: 'Open Type Definition Location',
			arguments: [
				vscode.Uri.parse(element.uri), <vscode.TextDocumentShowOptions>{ selection: element.selectionRange }
			]
		} : undefined;
		// workaround: set a specific id to refresh the collapsible state for treeItems, see: https://github.com/microsoft/vscode/issues/114614#issuecomment-763428052
		treeItem.id = `${element.data}${Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)}`;
		if (!this.baseTypeTraversed) {
			treeItem.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
		} else {
			if ((await typeHierarchyRepository.getSubtypes(element, this.token)).length > 0) {
				treeItem.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
			} else {
				treeItem.collapsibleState = vscode.TreeItemCollapsibleState.None;
			}
		}
		if (!this.baseTypeTraversed && element === this.navigation.getBaseItem()) {
			this.baseTypeTraversed = true;
		}
		return treeItem;
	}

	async getChildren(element?: TypeHierarchyItemCode | undefined): Promise<TypeHierarchyItemCode[]> {
		if (!element) {
			return [this.navigation.getRootItem()];
		}
		const subtypes = await typeHierarchyRepository.getSubtypes(element, this.token);
		if (subtypes.length === 0) {
			this._emitter.fire(element);
		}
		return subtypes;
	}

	private static themeIconIds = [
		'symbol-file', 'symbol-module', 'symbol-namespace', 'symbol-package', 'symbol-class', 'symbol-method',
		'symbol-property', 'symbol-field', 'symbol-constructor', 'symbol-enum', 'symbol-interface',
		'symbol-function', 'symbol-variable', 'symbol-constant', 'symbol-string', 'symbol-number', 'symbol-boolean',
		'symbol-array', 'symbol-object', 'symbol-key', 'symbol-null', 'symbol-enum-member', 'symbol-struct',
		'symbol-event', 'symbol-operator', 'symbol-type-parameter'
	];

	private static getThemeIcon(kind: vscode.SymbolKind): vscode.ThemeIcon | undefined {
		const id = ClassHierarchyTreeDataProvider.themeIconIds[kind];
		return id ? new vscode.ThemeIcon(id) : undefined;
	}
}

async function getRootItem(item: TypeHierarchyItemCode, token: vscode.CancellationToken): Promise<TypeHierarchyItemCode> {
	if (!item) {
		return undefined;
	}
	const supertypes = await typeHierarchyRepository.getSupertypes(item, token);
	if (supertypes.length === 0) {
		return item;
	}
	for (const supertype of supertypes) {
		if (supertype.kind === vscode.SymbolKind.Class) {
			typeHierarchyRepository.setSubtypes(supertype, item);
			return getRootItem(supertype, token);
		}
	}
	return item;
}