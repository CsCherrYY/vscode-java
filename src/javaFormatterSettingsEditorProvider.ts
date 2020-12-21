'use strict';

import { CancellationToken, CustomTextEditorProvider, ExtensionContext, TextDocument, WebviewPanel, workspace } from "vscode";
import { loadTextFromFile } from "./formatter/utils";

export class JavaFormatterSettingsEditorProvider implements CustomTextEditorProvider {

	public static readonly viewType = 'vscjava.javaFormatterSettings';

	constructor(
		private readonly context: ExtensionContext
	) { }

	public async resolveCustomTextEditor(document: TextDocument, webviewPanel: WebviewPanel, _token: CancellationToken): Promise<void> {
		webviewPanel.webview.options = {
			enableScripts: true,
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
		webviewPanel.webview.onDidReceiveMessage(e => {
		});

		updateWebview();
	}

}