import { JavaFormatterSettingPanel } from "../FormatterSettingConstants";

declare function acquireVsCodeApi(): any;
const vscode = acquireVsCodeApi();

export function formatCode(code: string, panel: JavaFormatterSettingPanel, format: boolean) {
	vscode.postMessage({
		command: "format",
		code: code,
		panel: panel,
		format: format,
	});
}

export function importSettings() {
	vscode.postMessage({
		command: "import",
	});
}

export function changeSetting(id: string, value: any) {
	vscode.postMessage({
		command: "changeSetting",
		id: id,
		value: value,
	});
}
