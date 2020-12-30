import { JavaFormatterSettingPanel } from ".";

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

export function exportSettings() {
	vscode.postMessage({
		command: "export",
	});
}

export function importSettings() {
	vscode.postMessage({
		command: "import",
	});
}

export function changeSettingString(id: string, value: string) {
	vscode.postMessage({
		command: "changeSettingString",
		id: id,
		value: value,
	});
}

export function changeSettingBoolean(id: string, value: boolean) {
	vscode.postMessage({
		command: "changeSettingBoolean",
		id: id,
		value: value,
	});
}