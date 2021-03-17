import { CancellationToken, commands, SymbolKind } from "vscode";
import { LanguageClient } from "vscode-languageclient";
import { Commands } from "../commands";
import { LSPTypeHierarchyItem, TypeHierarchyDirection, TypeHierarchyItem } from "./protocol";

export function ToSingleLSPTypeHierarchyItem(client: LanguageClient, typeHierarchyItem: TypeHierarchyItem): LSPTypeHierarchyItem {
	if (!typeHierarchyItem) {
		return undefined;
	}
	return {
		name: typeHierarchyItem.name,
		detail: typeHierarchyItem.detail,
		kind: client.code2ProtocolConverter.asSymbolKind(typeHierarchyItem.kind),
		deprecated: typeHierarchyItem.deprecated,
		uri: typeHierarchyItem.uri,
		range: client.code2ProtocolConverter.asRange(typeHierarchyItem.range),
		selectionRange: client.code2ProtocolConverter.asRange(typeHierarchyItem.selectionRange),
		data: typeHierarchyItem.data,
	};
}

export function ToTypeHierarchyItem(client: LanguageClient, lspTypeHierarchyItem: LSPTypeHierarchyItem, direction: TypeHierarchyDirection): TypeHierarchyItem {
	if (!lspTypeHierarchyItem) {
		return undefined;
	}
	return {
		name: lspTypeHierarchyItem.name,
		detail: lspTypeHierarchyItem.detail,
		kind: client.protocol2CodeConverter.asSymbolKind(lspTypeHierarchyItem.kind),
		deprecated: lspTypeHierarchyItem.deprecated,
		uri: lspTypeHierarchyItem.uri,
		range: client.protocol2CodeConverter.asRange(lspTypeHierarchyItem.range),
		selectionRange: client.protocol2CodeConverter.asRange(lspTypeHierarchyItem.selectionRange),
		parents: undefined,
		children: undefined,
		data: lspTypeHierarchyItem.data,
		expand: false,
	};
}

export function typeHierarchyDirectionToContextString(direction: TypeHierarchyDirection): string {
	switch (direction) {
		case TypeHierarchyDirection.Children:
			return "children";
		case TypeHierarchyDirection.Parents:
			return "parents";
		case TypeHierarchyDirection.Both:
			return "both";
		default:
			return undefined;
	}
}

export async function resolveTypeHierarchy(client: LanguageClient, typeHierarchyItem: TypeHierarchyItem, direction: TypeHierarchyDirection, token: CancellationToken): Promise<TypeHierarchyItem[]> {
	// direction can be only children or parents here.
	const lspTypeHierarchyItem = ToSingleLSPTypeHierarchyItem(client, typeHierarchyItem);
	let resolvedLSPItems: LSPTypeHierarchyItem[];
	try {
		resolvedLSPItems = await commands.executeCommand<LSPTypeHierarchyItem[]>(Commands.EXECUTE_WORKSPACE_COMMAND, Commands.RESOLVE_TYPE_HIERARCHY, JSON.stringify(lspTypeHierarchyItem), JSON.stringify(direction), JSON.stringify(1), token);
	} catch (e) {
		// operation cancelled
		return undefined;
	}
	let resolvedItems: TypeHierarchyItem[] = [];
	for (const lspItem of resolvedLSPItems) {
		resolvedItems.push(ToTypeHierarchyItem(client, lspItem, direction));
	}
	resolvedItems = resolvedItems.sort((a, b) => {
		return (a.kind.toString() === b.kind.toString()) ? a.name.localeCompare(b.name) : b.kind.toString().localeCompare(a.kind.toString());
	});
	return resolvedItems;
}

export async function getRootItem(client: LanguageClient, typeHierarchyItem: TypeHierarchyItem, token: CancellationToken): Promise<TypeHierarchyItem> {
	if (!typeHierarchyItem) {
		return undefined;
	}
	if (!typeHierarchyItem.parents) {
		const parents = await resolveTypeHierarchy(client, typeHierarchyItem, TypeHierarchyDirection.Parents, token);
		if (!parents) {
			return typeHierarchyItem;
		} else {
			typeHierarchyItem.parents = parents;
		}
	}
	if (typeHierarchyItem.parents.length === 0) {
		return typeHierarchyItem;
	} else {
		for (const parent of typeHierarchyItem.parents) {
			if (parent.kind === SymbolKind.Class) {
				parent.children = [typeHierarchyItem];
				parent.expand = true;
				return getRootItem(client, parent, token);
			}
		}
		return typeHierarchyItem;
	}
}
