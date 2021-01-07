'use strict';

import { readFileSync, writeFileSync } from "fs";
import { existsSync } from "fs-extra";
import { join } from "path";
import { CancellationToken, commands, CustomTextEditorProvider, ExtensionContext, Range, TextDocument, TextEdit, Uri, WebviewPanel, workspace, WorkspaceEdit } from "vscode";
import { FormattingOptions } from "vscode-languageclient";
import { Commands } from "./commands";
import { FormatterSettingConstants, JavaFormatterSettingPanel } from "./formatter/FormatterSettingConstants";
import { formatterSettingConverter } from "./formatter/FormatterSettingConverter";
const xml2js = require('xml2js');
export class JavaFormatterSettingsEditorProvider implements CustomTextEditorProvider {

	public static readonly viewType = 'vscjava.javaFormatterSettings';

	private tabsize: number = 4;

	private useSpaces: boolean = true;

	private storagePath: string;

	constructor(private readonly context: ExtensionContext, storagePath: string) {
		this.storagePath = storagePath;
	}

	private async changeFormatterSettings(document: TextDocument, targetSetting: string, settingValue: string): Promise<any> {
		const text: string = document.getText();
		if (text.trim().length === 0) {
			return;
		}
		try {
			const result = await xml2js.parseStringPromise(text);
			if (result.profiles.profile.length === 1) {
				for (const setting of result.profiles.profile[0].setting) {
					if (setting.$.id === targetSetting) {
						setting.$.value = settingValue;
					}
				}
			}
			if (targetSetting === "org.eclipse.jdt.core.formatter.tabulation.size") {
				this.tabsize = +settingValue;
			} else if (targetSetting === "org.eclipse.jdt.core.formatter.tabulation.size") {
				this.useSpaces = settingValue !== "tab";
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
					const formatterFilePath: string = join(this.storagePath, `formatter.java`);
					if (!existsSync(formatterFilePath)) {
						writeFileSync(formatterFilePath, codeToFormat);
					}
					const formatterUri: Uri = Uri.file(formatterFilePath);
					const document = await workspace.openTextDocument(formatterFilePath);
					if (!format) {
						webviewPanel.webview.postMessage({
							command: "formattedCode",
							code: codeToFormat,
							panel: e.panel
						});
						const workspaceEditPre: WorkspaceEdit = new WorkspaceEdit();
						workspaceEditPre.replace(formatterUri, new Range(0, 0, document.lineCount, 0), codeToFormat);
						await workspace.applyEdit(workspaceEditPre);
						document.save();
						return;
					}
					const workspaceEditPre: WorkspaceEdit = new WorkspaceEdit();
					workspaceEditPre.replace(formatterUri, new Range(0, 0, document.lineCount, 0), codeToFormat);
					await workspace.applyEdit(workspaceEditPre);
					document.save();
					const formattingOptions: FormattingOptions = {
						tabSize: this.tabsize,
						insertSpaces: this.useSpaces,
					};
					const result = await commands.executeCommand<TextEdit[]>(
						"vscode.executeFormatDocumentProvider", Uri.file(formatterFilePath), formattingOptions);
					const workspaceEdit: WorkspaceEdit = new WorkspaceEdit();
					if (!result || result.length === 0) {
						return;
					}
					workspaceEdit.set(formatterUri, result);
					await workspace.applyEdit(workspaceEdit);
					document.save();
					const text = document.getText();
					webviewPanel.webview.postMessage({
						command: "formattedCode",
						code: text,
						panel: e.panel
					});
					break;
				}
				case "import": {
					commands.executeCommand(Commands.IMPORT_ECLIPSE_PROFILE);
					break;
				}
				case "changeSetting": {
					let settings: string = formatterSettingConverter.convert(e.id);
					if (!settings) {
						return;
					}
					const settingsDivide: string[] = settings.split('|');
					const group = settingsDivide[0];
					settings = settingsDivide[settingsDivide.length - 1];
					const settingValue: string = formatterSettingConverter.valueConvert(settings, e.value.toString());
					if (!settingValue) {
						return;
					}
					this.changeFormatterSettings(document, settings, settingValue);
					let targetPanel: string;
					switch (group) {
						case JavaFormatterSettingPanel.WHITESPACE:
							targetPanel = JavaFormatterSettingPanel.WHITESPACE;
							break;
						case JavaFormatterSettingPanel.BLANKLINE:
							targetPanel = JavaFormatterSettingPanel.BLANKLINE;
							break;
						case JavaFormatterSettingPanel.COMMENT:
							targetPanel = JavaFormatterSettingPanel.COMMENT;
							break;
						case JavaFormatterSettingPanel.NEWLINE:
							targetPanel = JavaFormatterSettingPanel.NEWLINE;
							break;
						case JavaFormatterSettingPanel.COMMON:
							targetPanel = JavaFormatterSettingPanel.COMMON;
							break;
						case JavaFormatterSettingPanel.WRAPPING:
							targetPanel = JavaFormatterSettingPanel.WRAPPING;
							break;
						default:
							return;
					}
					/*webviewPanel.webview.postMessage({
						command: "formatCode",
						panel: targetPanel
					});*/
					break;
				}
				default:
					break;
			}
		});

		updateWebview();
	}

}
