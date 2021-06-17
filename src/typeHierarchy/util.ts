import { LanguageClient } from "vscode-languageclient/node";
import { TypeHierarchyItemCode, TypeHierarchyItemLSP, TypeHierarchyView } from "../protocol";

export function ToTypeHierarchyItemLSP(client: LanguageClient, item: TypeHierarchyItemCode): TypeHierarchyItemLSP {
	if (!item) {
		return undefined;
	}
	return {
		name: item.name,
		detail: item.detail,
		kind: client.code2ProtocolConverter.asSymbolKind(item.kind),
		tags: item.tags ? client.code2ProtocolConverter.asSymbolTags(item.tags) : undefined,
		uri: item.uri,
		range: client.code2ProtocolConverter.asRange(item.range),
		selectionRange: client.code2ProtocolConverter.asRange(item.selectionRange),
		data: item.data,
	};
}

export function ToTypeHierarchyItemCode(client: LanguageClient, item: TypeHierarchyItemLSP): TypeHierarchyItemCode {
	if (!item) {
		return undefined;
	}
	return {
		name: item.name,
		detail: item.detail,
		kind: client.protocol2CodeConverter.asSymbolKind(item.kind),
		tags: item.tags ? client.protocol2CodeConverter.asSymbolTags(item.tags) : undefined,
		uri: item.uri,
		range: client.protocol2CodeConverter.asRange(item.range),
		selectionRange: client.protocol2CodeConverter.asRange(item.selectionRange),
		data: item.data,
	};
}

export function typeHierarchyViewToContextString(view: TypeHierarchyView): string {
	switch (view) {
		case TypeHierarchyView.Supertype:
			return "supertype";
		case TypeHierarchyView.Subtype:
			return "subtype";
		case TypeHierarchyView.Class:
			return "class";
		default:
			return undefined;
	}
}
