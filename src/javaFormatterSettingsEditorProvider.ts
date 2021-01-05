'use strict';

import { readFileSync, writeFileSync } from "fs";
import { existsSync } from "fs-extra";
import { join } from "path";
import { CancellationToken, commands, CustomTextEditorProvider, ExtensionContext, Range, TextDocument, TextEdit, Uri, WebviewPanel, workspace, WorkspaceEdit } from "vscode";
import { FormattingOptions } from "vscode-languageclient";
import { Commands } from "./commands";
import { formatterSettingConverter } from "./formatter/FormatterSettingConverter";
const xml2js = require('xml2js');
export class JavaFormatterSettingsEditorProvider implements CustomTextEditorProvider {

	public static readonly viewType = 'vscjava.javaFormatterSettings';

	private storagePath: string;

	constructor(private readonly context: ExtensionContext, storagePath: string) {
		this.storagePath = storagePath;
	}

	private async changeFormatterSettings(document: TextDocument, targetSettings: string[], settingValue: string): Promise<any> {
		const text: string = document.getText();
		if (text.trim().length === 0) {
			return;
		}
		try {
			const result = await xml2js.parseStringPromise(text);
			if (result.profiles.profile.length === 1) {
				for (const setting of result.profiles.profile[0].setting) {
					for (const targetSetting of targetSettings) {
						if (setting.$.id === targetSetting) {
							setting.$.value = settingValue;
						}
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
			document.save();
		} catch (e) {
			throw new Error(e);
		}
	}

	private loadFormatterSettings(document: TextDocument) {
		const text: string = document.getText();
		if (text.trim().length === 0) {
			return;
		}
	}

	public async resolveCustomTextEditor(document: TextDocument, webviewPanel: WebviewPanel, _token: CancellationToken): Promise<void> {
		webviewPanel.webview.options = {
			enableScripts: true,
			enableCommandUris: true,
		};
		const resourceUri = this.context.asAbsolutePath("./dist/assets/formatter/index.html");
		const buffer: string = readFileSync(resourceUri).toString();
		webviewPanel.webview.html = buffer;

		async function updateWebview() {
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
						writeFileSync(formatterFilePath, codeToFormat);
					}
					const formatterUri: Uri = Uri.file(formatterFilePath);
					const document = await workspace.openTextDocument(formatterFilePath);
					const workspaceEditPre: WorkspaceEdit = new WorkspaceEdit();
					workspaceEditPre.replace(formatterUri, new Range(0, 0, document.lineCount, 0), codeToFormat);
					await workspace.applyEdit(workspaceEditPre);
					const formattingOptions: FormattingOptions = {
						tabSize: 4,
						insertSpaces: true,
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
						code: document.getText(),
						panel: e.panel
					});
					document.save();
					// const workspaceEditClean: WorkspaceEdit = new WorkspaceEdit();
					// workspaceEditClean.deleteFile(formatterUri);
					// await workspace.applyEdit(workspaceEditClean);
					break;
				}
				case "import": {
					commands.executeCommand(Commands.IMPORT_ECLIPSE_PROFILE);
				}
				case "changeSetting": {
					const settings: string[] = formatterSettingConverter.convert(e.id);
					if (!settings) {
						return;
					}
					const settingValue: string = formatterSettingConverter.valueConvert(e.id, e.value.toString());
					this.changeFormatterSettings(document, settings, settingValue);
					break;
				}
				default:
					break;
			}
		});

		updateWebview();
	}

}
