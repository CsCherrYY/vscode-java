'use strict';

const fsPromise = require('fs').promises;
import { writeFileSync } from "fs";
import { existsSync } from "fs-extra";
import { join } from "path";
import { CancellationToken, commands, CommentThreadCollapsibleState, CustomTextEditorProvider, ExtensionContext, Range, Position, TextDocument, TextEdit, Uri, WebviewPanel, window, workspace, WorkspaceEdit, TextEditor, comments, CustomDocumentOpenContext } from "vscode";
import { DocumentFormattingParams, FormattingOptions, LanguageClient, TextDocumentIdentifier } from "vscode-languageclient";
import { filename } from "winston-daily-rotate-file";
import { Commands } from "./commands";
import { getActiveLanguageClient } from "./extension";
import { JavaFormatterSettingPanel } from "./formatter/assets";
import { loadTextFromFile } from "./formatter/index";
const xml2js = require('xml2js');
export class JavaFormatterSettingsEditorProvider implements CustomTextEditorProvider {

	public static readonly viewType = 'vscjava.javaFormatterSettings';

	private storagePath: string;

	constructor(private readonly context: ExtensionContext, storagePath: string) {
		this.storagePath = storagePath;
	}

	private async changeFormatterSettings(document: TextDocument, settingName: string, settingValue: string): Promise<any> {
		const text: string = document.getText();
		if (text.trim().length === 0) {
			return {};
		}
		try {
			const result = await xml2js.parseStringPromise(text);
			if (result.profiles.profile.length === 1) {
				for (const setting of result.profiles.profile[0].setting) {
					const a = setting.$;
					if (setting.$.id === settingName) {
						setting.$.value = settingValue;
					}
				}
			}
			const builder = new xml2js.Builder();
			const resultObject = builder.buildObject(result);
			const edit = new WorkspaceEdit();

			edit.replace(
				document.uri,
				new Range(0, 0, document.lineCount, 0),
				resultObject);

			await workspace.applyEdit(edit);
			return {};
		} catch (e) {
			throw new Error(e);
		}
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
			const a = e.affectsConfiguration("java.format.insertSpace");
			if (e.affectsConfiguration("java.format.comments.offOnTag")) {
				webviewPanel.webview.postMessage({
					command: "formatCode",
					panel: "comment",
				});
			} else if (e.affectsConfiguration("java.format.insertLine.controlStatement") || e.affectsConfiguration("java.format.insertLine.controlStatement.keepSimple")) {
				webviewPanel.webview.postMessage({
					command: "formatCode",
					panel: "wrapping",
				});
			} else {
				webviewPanel.webview.postMessage({
					command: "formatCode",
					panel: "whiteSpace",
				});
			}
		}));

		webviewPanel.onDidDispose(() => {
			changeDocumentSubscription.dispose();
		});

		// Receive message from the webview.
		webviewPanel.webview.onDidReceiveMessage(async (e) => {
			switch (e.command) {
				case "format": {
					const codeToFormat: string = e.code;
					const format: boolean = e.format;
					if (!format) {
						webviewPanel.webview.postMessage({
							command: "formattedCode",
							code: codeToFormat,
							panel: e.panel
						});
						return;
					}
					const formatterFilePath: string = join(this.storagePath, `formatter.java`);
					if (!existsSync(formatterFilePath)) {
						await fsPromise.writeFile(formatterFilePath, codeToFormat);
					}
					const formatterUri: Uri = Uri.file(formatterFilePath);
					const document = await workspace.openTextDocument(formatterFilePath);
					const workspaceEditPre: WorkspaceEdit = new WorkspaceEdit();
					workspaceEditPre.replace(formatterUri, new Range(0, 0, document.lineCount, 0), codeToFormat);
					await workspace.applyEdit(workspaceEditPre);
					const formattingOptions: FormattingOptions = {
						tabSize: 4,
						insertSpaces: false,
					};
					const result = await commands.executeCommand<TextEdit[]>(
						"vscode.executeFormatDocumentProvider", Uri.file(formatterFilePath), formattingOptions);
					if (!result) {
						return;
					}
					// const edit = this.client.protocol2CodeConverter.asTextEdits(result);
					const workspaceEdit: WorkspaceEdit = new WorkspaceEdit();
					workspaceEdit.set(formatterUri, result);
					await workspace.applyEdit(workspaceEdit);
					await webviewPanel.webview.postMessage({
						command: "formattedCode",
						code: /*hljs.highlightAuto(document.getText()).value*/document.getText(),
						panel: e.panel
					});
					// const workspaceEditClean: WorkspaceEdit = new WorkspaceEdit();
					// workspaceEditClean.deleteFile(formatterUri);
					// await workspace.applyEdit(workspaceEditClean);
					break;
				}
				case "import": {
					commands.executeCommand(Commands.IMPORT_ECLIPSE_PROFILE);
				}
				case "changeSetting": {
					/*const id: string = e.id;
					const dotIndex = id.lastIndexOf(".");
					const configurationName = id.substring(0, dotIndex);
					const settingName = id.substring(dotIndex + 1);
					await workspace.getConfiguration(configurationName).update(settingName, e.value);*/
					e.id = "org.eclipse.jdt.core.formatter.insert_space_after_multiplicative_operator";
					e.value = "do not insert";
					this.changeFormatterSettings(document, e.id, e.value.toString());
					break;
				}
				default:
					break;
			}
		});

		updateWebview();
	}

}
