'use strict';

const fs = require('fs').promises;
import { join } from "path";
import { CancellationToken, commands, CommentThreadCollapsibleState, CustomTextEditorProvider, ExtensionContext, Position, TextDocument, TextEdit, Uri, WebviewPanel, window, workspace, WorkspaceEdit } from "vscode";
import { DocumentFormattingParams, FormattingOptions, LanguageClient, TextDocumentIdentifier } from "vscode-languageclient";
import { getActiveLanguageClient } from "./extension";
import { loadTextFromFile } from "./formatter/index";

export class JavaFormatterSettingsEditorProvider implements CustomTextEditorProvider {

	public static readonly viewType = 'vscjava.javaFormatterSettings';

	private client: LanguageClient;

	private storagePath: string;

	constructor(private readonly context: ExtensionContext, storagePath: string) {
		this.storagePath = storagePath;
	}

	public async resolveCustomTextEditor(document: TextDocument, webviewPanel: WebviewPanel, _token: CancellationToken): Promise<void> {
		webviewPanel.webview.options = {
			enableScripts: true,
			enableCommandUris: true,
		};
		const resourceUri = this.context.asAbsolutePath("./dist/assets/formatter/index.html");
		webviewPanel.webview.html = await loadTextFromFile(resourceUri);

		function updateWebview() {
			webviewPanel.webview.postMessage({
				type: 'update',
				text: document.getText(),
			});
		}

		const changeDocumentSubscription = workspace.onDidChangeTextDocument(e => {
			if (e.document.uri.toString() === document.uri.toString()) {
				updateWebview();
			}
		});

		webviewPanel.onDidDispose(() => {
			changeDocumentSubscription.dispose();
		});

		// Receive message from the webview.
		webviewPanel.webview.onDidReceiveMessage(async (e) => {
			switch (e.command) {
				case "format": {
					const code: string = e.code;
					const formatterFilePath: string = join(this.storagePath, `${Date.now()}.java`);
					await fs.writeFile(formatterFilePath, code);
					const formatterUri: Uri = Uri.file(formatterFilePath);
					const document = await workspace.openTextDocument(formatterFilePath);
					const formattingOptions: FormattingOptions = {
						tabSize: 4,
						insertSpaces: false,
					};
					if (!this.client) {
						this.client = await getActiveLanguageClient();
						if (!this.client) {
							return;
						}
					}
					const result = await commands.executeCommand<TextEdit[]>(
						"vscode.executeFormatDocumentProvider", Uri.file(formatterFilePath), formattingOptions);
					if (!result) {
						return;
					}
					const edit = this.client.protocol2CodeConverter.asTextEdits(result);
					const workspaceEdit: WorkspaceEdit = new WorkspaceEdit();
					workspaceEdit.set(formatterUri, edit);
					await workspace.applyEdit(workspaceEdit);
					await document.save();
					await webviewPanel.webview.postMessage({
						command: "formattedCode",
						code: (await fs.readFile(formatterFilePath)).toString(),
					});
					const workspaceEditClean: WorkspaceEdit = new WorkspaceEdit();
					workspaceEditClean.deleteFile(formatterUri);
					await workspace.applyEdit(workspaceEditClean);
					break;
				}
				case "export": {
					commands.executeCommand("vscode.open", Uri.file("code"));
					break;
				}
				default:
					break;
			}
		});

		updateWebview();
	}

}