'use strict';

const fs = require('fs').promises;
import { join } from "path";
import { CancellationToken, commands, CommentThreadCollapsibleState, CustomTextEditorProvider, ExtensionContext, Position, TextDocument, TextEdit, Uri, WebviewPanel, window, workspace, WorkspaceEdit } from "vscode";
import { DocumentFormattingParams, FormattingOptions, LanguageClient, TextDocumentIdentifier } from "vscode-languageclient";
import { Commands } from "./commands";
import { getActiveLanguageClient } from "./extension";
import { JavaFormatterSettingPanel } from "./formatter/assets";
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

		async function updateWebview() {
			const settings: string[] = ["java.format.insertLine.controlStatement",
			"java.format.insertLine.controlStatement.keepSimple",
			"java.format.comments.offOnTag",
			"java.format.insertSpace.before.binaryOperator",
			"java.format.insertSpace.after.binaryOperator",
			"java.format.insertSpace.before.comma",
			"java.format.insertSpace.after.comma",
			"java.format.insertSpace.before.closingParenthesis",
			"java.format.insertSpace.before.openingParenthesis.controlStatement",
			"java.format.insertSpace.after.openingParenthesis",
			"java.format.insertSpace.before.openingBrace"];
			for (const setting of settings) {
				const dotIndex = setting.lastIndexOf(".");
				const configurationName = setting.substring(0, dotIndex);
				const settingName = setting.substring(dotIndex + 1);
				const value = await workspace.getConfiguration(configurationName).get(settingName);
				await webviewPanel.webview.postMessage({
					command: "changeSettings",
					id: setting,
					value: value
				});
			}
		}

		const changeDocumentSubscription = workspace.onDidChangeTextDocument(e => {
			if (e.document.uri.toString() === document.uri.toString()) {
				updateWebview();
			}
		});

		this.context.subscriptions.push(workspace.onDidChangeConfiguration((e) => {
			webviewPanel.webview.postMessage({
				command: "formatCode"
			});
		}));

		webviewPanel.onDidDispose(() => {
			changeDocumentSubscription.dispose();
		});

		// Receive message from the webview.
		webviewPanel.webview.onDidReceiveMessage(async (e) => {
			switch (e.command) {
				case "format": {
					const codeToFormat: string = e.code;
					const panelType = e.panel;
					const formatterFilePath: string = join(this.storagePath, `${Date.now()}.java`);
					await fs.writeFile(formatterFilePath, codeToFormat);
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
						panel: panelType
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
				case "import": {
					commands.executeCommand(Commands.IMPORT_ECLIPSE_PROFILE);
				}
				case "changeSettingString": {
					const id: string = e.id;
					const dotIndex = id.lastIndexOf(".");
					const configurationName = id.substring(0, dotIndex);
					const settingName = id.substring(dotIndex + 1);
					await workspace.getConfiguration(configurationName).update(settingName, e.value);
					break;
				}
				case "changeSettingBoolean": {
					const id: string = e.id;
					const dotIndex = id.lastIndexOf(".");
					const configurationName = id.substring(0, dotIndex);
					const settingName = id.substring(dotIndex + 1);
					await workspace.getConfiguration(configurationName).update(settingName, e.value);
					break;
				}
				case "formatCodeOnDidChangeSettings": {
					await webviewPanel.webview.postMessage({
						command: "formatCode"
					});
				}
				default:
					break;
			}
		});

		updateWebview();
	}

}
