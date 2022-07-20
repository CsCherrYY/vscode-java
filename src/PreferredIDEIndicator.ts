'use strict';

import * as vscode from "vscode";

const INTELLIJ_KEYBINDING_EXTENSION = "k--kato.intellij-idea-keybindings";
const ECLIPSE_KEYBINDING_EXTENSION = "alphabotsec.vscode-eclipse-keybindings";

export enum PreferredIDE {
	IntelliJ = "IntelliJ",
	Eclipse = "Eclipse",
	None = "None",
}

/**
 * Try to get the possible preferred IDE from corresponding keybinding extensions
 * @returns The preferred IDE
 */
export function getPreferredIDE(): PreferredIDE {
	if (vscode.extensions.getExtension(INTELLIJ_KEYBINDING_EXTENSION)) {
		return PreferredIDE.IntelliJ;
	}
	if (vscode.extensions.getExtension(ECLIPSE_KEYBINDING_EXTENSION)) {
		return PreferredIDE.Eclipse;
	}
	return PreferredIDE.None;
}
