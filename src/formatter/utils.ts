/* eslint-disable @typescript-eslint/prefer-for-of */

import * as vscode from "vscode";
import { JavaConstants } from "./FormatterConstants";

export function openFormatterSettings(): void {
    vscode.commands.executeCommand("workbench.action.openSettings", JavaConstants.JAVA_FORMATTER_SCHEME);
    if (vscode.workspace.workspaceFolders?.length) {
        vscode.commands.executeCommand("workbench.action.openWorkspaceSettings");
    }
}

export function convertDotCaseToCamelCase(input: string): string {
    return input.replace(/(\.\w)/g, (m) => m[1].toUpperCase());
}
