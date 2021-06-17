import * as vscode from "vscode";
import { TypeHierarchyItemCode } from "../protocol";

export class TypeHierarchyRepository {

	private supertypeMap = new Map<TypeHierarchyItemCode, TypeHierarchyItemCode[]>();
	private subtypeMap = new Map<TypeHierarchyItemCode, TypeHierarchyItemCode[]>();

	public async getSupertypes(item: TypeHierarchyItemCode, token?: vscode.CancellationToken): Promise<TypeHierarchyItemCode[]> {
		const cache = this.supertypeMap.get(item);
		if (cache) {
			return cache;
		}
		const supertypes = await vscode.commands.executeCommand<TypeHierarchyItemCode[]>("java.supertypes", item, token);
		this.supertypeMap.set(item, supertypes);
		return supertypes;
	}

	public async getSubtypes(item: TypeHierarchyItemCode, token?: vscode.CancellationToken): Promise<TypeHierarchyItemCode[]> {
		const cache = this.subtypeMap.get(item);
		if (cache) {
			return cache;
		}
		const subtypes = await vscode.commands.executeCommand<TypeHierarchyItemCode[]>("java.subtypes", item, token);
		this.subtypeMap.set(item, subtypes);
		return subtypes;
	}

	public setSubtypes(item: TypeHierarchyItemCode, subtype: TypeHierarchyItemCode): void {
		this.subtypeMap.set(item, [subtype]);
	}

	public isSubtypesResolved(item: TypeHierarchyItemCode): boolean {
		return this.subtypeMap.has(item);
	}

	public isSupertypesResolved(item: TypeHierarchyItemCode): boolean {
		return this.supertypeMap.has(item);
	}

	public clear(): void {
		this.subtypeMap.clear();
		this.supertypeMap.clear();
	}
}

export const typeHierarchyRepository = new TypeHierarchyRepository();
