// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

import * as path from "path";
import * as vscode from "vscode";
import { CURRENT_FORMATTER_SETTINGS_VERSION, FormatterScheme, FormatterSchemes, getDefaultJavaFormatterSettings, getInvalidFormatterSchemeMessage, JavaConstants } from "./FormatterConstants";
import { openFormatterSettings } from "./utils";
import { getNonce, getUri } from "../webviewUtils";
import { Commands } from "../commands";
import { JavaFormatterSettingMetadata } from "./types";

export class FormatterSettingsPanel {
    public static type = "java.format.settings";
    public static title = "Java Formatter Settings";
    public static currentPanel: FormatterSettingsPanel | undefined;

    private static messageForProfile = "The active formatter scheme is configured with a profile, please directly modify it or use 'java.format.scheme.configurations' instead.";
    private static messageForUnsupportedScheme = "The active formatter scheme is not supported, please check setting 'java.format.scheme' and try again.";
    private static messageForNotConfigurableScheme = "Only 'eclipse' formatter scheme is configurable, please check setting 'java.format.scheme' and try again.";

    private readonly panel: vscode.WebviewPanel;
    private disposables: vscode.Disposable[] = [];
    private extensionUri: vscode.Uri;

    // VS Code settings
    private configurations: Map<string, JavaFormatterSettingMetadata> = new Map<string, JavaFormatterSettingMetadata>();

    private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
        this.panel = panel;
        this.panel.onDidDispose(() => this.dispose(), null, this.disposables);
        this.panel.webview.html = this.getWebviewContent(this.panel.webview, extensionUri);
        this.setWebviewMessageListener(this.panel.webview);
        this.configurations = getDefaultJavaFormatterSettings();
        this.checkVSCodeSettings();
        this.extensionUri = extensionUri;
        this.disposables.push(
            vscode.workspace.onDidChangeConfiguration(async (e) => {
                if (e.affectsConfiguration(`java.${JavaConstants.SETTINGS_URL_KEY}`) || e.affectsConfiguration(`java.${JavaConstants.SETTINGS_PROFILE_KEY}`) || e.affectsConfiguration(`java.${JavaConstants.JAVA_FORMATTER_SCHEME}`)) {
                    this.onChangeProfileSettings();
                }
            })
        );
    }

    private onChangeProfileSettings(): void {
        if (this.panel.visible) {
            vscode.window.showInformationMessage(`Java formatter settings have been changed, do you want to reload the formatter settings panel?`,
                "Yes", "No").then(async (result) => {
                    if (result === "Yes") {
                        const extensionUri = this.extensionUri;
                        this.dispose();
                        FormatterSettingsPanel.render(extensionUri, true /** force */);
                    }
                });
        }
    }

    private checkVSCodeSettings(): void {
        const scheme: object = vscode.workspace.getConfiguration("java").get(JavaConstants.JAVA_FORMATTER_SCHEME);
        if (!scheme) {
            // check compatibility with deprecated java.format.setting.url and java.format.settings.profile
            if (vscode.workspace.getConfiguration("java").get(JavaConstants.SETTINGS_URL_KEY)) {
                this.showNotification(FormatterSettingsPanel.messageForProfile);
            }
            return;
        } else if (typeof scheme === "string") {
            if (!(scheme in FormatterSchemes)) {
                this.showNotification(FormatterSettingsPanel.messageForUnsupportedScheme);
            } else if (scheme !== FormatterSchemes.eclipse){
                this.showNotification(FormatterSettingsPanel.messageForNotConfigurableScheme);
            }
            return;
        } else if (typeof scheme === "object") {
            const schemeObject = scheme as FormatterScheme;
            if (!schemeObject.style || !(schemeObject.style in FormatterSchemes)) {
                this.showNotification(FormatterSettingsPanel.messageForUnsupportedScheme);
                return;
            } else if (schemeObject.style !== FormatterSchemes.eclipse) {
                this.showNotification(FormatterSettingsPanel.messageForNotConfigurableScheme);
                return;
            }
            if (schemeObject.path) {
                this.showNotification(FormatterSettingsPanel.messageForProfile);
                return;
            }
            this.configurations.clear();
            if (typeof schemeObject.configurations === "object") {
                Object.entries(schemeObject.configurations).forEach(([key, value]) => {
                    if (this.configurations.has(key)) {
                        if (typeof value === "string") {
                            this.configurations.get(key).value = value;
                        } else if (typeof value === "object") {
                            // TODO: alignment object values
                        }
                    }
                });
            }
            return;
        }
    }

    public static render(extensionUri: vscode.Uri, force?: boolean) {
        if (FormatterSettingsPanel.currentPanel && !force) {
            FormatterSettingsPanel.currentPanel.panel.reveal(vscode.ViewColumn.Beside);
        } else {
            const panel = vscode.window.createWebviewPanel(
                FormatterSettingsPanel.type,
                FormatterSettingsPanel.title,
                vscode.ViewColumn.Beside,
                {
                    enableCommandUris: true,
                    enableScripts: true,
                    localResourceRoots: [vscode.Uri.joinPath(extensionUri, "dist")],
                    retainContextWhenHidden: true,
                }
            );
            panel.iconPath = vscode.Uri.file(path.join(extensionUri.fsPath, "icons", "icon128.png"));
            FormatterSettingsPanel.currentPanel = new FormatterSettingsPanel(panel, extensionUri);
        }
    }

    public dispose() {
        FormatterSettingsPanel.currentPanel = undefined;
        this.panel.dispose();
        while (this.disposables.length) {
            const disposable = this.disposables.pop();
            if (disposable) {
                disposable.dispose();
            }
        }
    }

    private getWebviewContent(webview: vscode.Webview, extensionUri: vscode.Uri) {
        const scriptUri = getUri(webview, extensionUri, [
            "dist",
            "formatter.js",
        ]);

        const nonce = getNonce();

        return /* html*/ `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
          <meta name="theme-color" content="#000000">
          <title>Java Formatter Settings</title>
        </head>
        <body>
          <div id="root"></div>
          <script nonce="${nonce}" src="${scriptUri}"></script>
        </body>
        </html>
        `;
    }

    private setWebviewMessageListener(webview: vscode.Webview) {
        webview.onDidReceiveMessage(async (e) => {
            switch (e.command) {
                // case "onWillInitialize":
                //     if (!await this.initialize(document)) {
                //         this.webviewPanel?.dispose();
                //     }
                //     break;
                // case "onWillChangeExampleKind":
                //     if (this.exampleKind !== e.exampleKind) {
                //         this.exampleKind = e.exampleKind;
                //         this.format();
                //     }
                //     break;
                // case "onWillChangeSetting":
                //     const settingValue: string | undefined = FormatterConverter.webView2ProfileConvert(e.id, e.value.toString());
                //     // "" represents an empty inputbox, we regard it as a valid value.
                //     if (settingValue === undefined) {
                //         return;
                //     }
                //     if (SupportedSettings.indentationSettings.includes(e.id)) {
                //         const config = vscode.workspace.getConfiguration(undefined, { languageId: "java" });
                //         if (e.id === SupportedSettings.TABULATION_CHAR) {
                //             const targetValue = (settingValue === "tab") ? false : true;
                //             await config.update(VSCodeSettings.INSERT_SPACES, targetValue, undefined, true);
                //         } else if (e.id === SupportedSettings.TABULATION_SIZE) {
                //             await config.update(VSCodeSettings.TAB_SIZE, (settingValue === "") ? "" : Number(settingValue), undefined, true);
                //         }
                //         // this.profileSettings.set(e.id, settingValue);
                //     } else if (e.id === VSCodeSettings.DETECT_INDENTATION) {
                //         const config = vscode.workspace.getConfiguration(undefined, { languageId: "java" });
                //         await config.update(VSCodeSettings.DETECT_INDENTATION, (settingValue === "true"), undefined, true);
                //     } else {
                //         // await this.modifyProfile(e.id, settingValue, document);
                //     }
                //     break;
                // case "onWillDownloadAndUse": {
                //     const settingsUrl = vscode.workspace.getConfiguration("java").get<string>(JavaConstants.SETTINGS_URL_KEY);
                //     if (!settingsUrl || !isRemote(settingsUrl)) {
                //         vscode.window.showErrorMessage("The active formatter profile does not exist or is not remote, please check it in the Settings and try again.",
                //             "Open Settings").then((result) => {
                //                 if (result === "Open Settings") {
                //                     openFormatterSettings();
                //                 }
                //             });
                //         return;
                //     }
                //     // this.webviewPanel?.dispose();
                //     // await this.downloadAndUse(settingsUrl);
                //     break;
                // }
                default:
                    break;
            }
        });
    }

    private async format(content: string): Promise<void> {
        const formattedContent = await vscode.commands.executeCommand<string>(Commands.EXECUTE_WORKSPACE_COMMAND, "java.edit.stringFormatting", content, JSON.stringify([...this.configurations]), CURRENT_FORMATTER_SETTINGS_VERSION);
        if (this.panel.webview) {
            this.panel.webview.postMessage({
                command: "formattedContent",
                content: formattedContent,
            });
        }
    }

    private async showNotification(message: string): Promise<void> {
        const answer = await vscode.window.showInformationMessage(message, "Open Settings");
        if (answer === "Open Settings") {
            openFormatterSettings();
        }
    }
}
