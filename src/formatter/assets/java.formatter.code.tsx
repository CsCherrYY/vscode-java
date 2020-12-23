import * as _ from "lodash";
import "bootstrap/js/src/tab";
import * as $ from "jquery";
import * as React from "react";
import * as ReactDOM from "react-dom";
import "../css/vscode.scss";
import { formatCode } from "./vscode.api";
import { JavaFormatterSettingPanel } from ".";

const code = "class MyClass \{\n\tint a = 0, b = 1, c = 2, d = 3;\n\}";
interface CodePreviewPanelProps {
	code: string;
	panel: JavaFormatterSettingPanel;
}

interface CodePreviewPanelStates {
	value: string;  //To display
	code: string;
	formattedCode: string;
	lastStepIsFormat: boolean;
}
export class CodePreviewPanel extends React.Component<CodePreviewPanelProps, CodePreviewPanelStates> {

	constructor(props: CodePreviewPanelProps) {
		super(props);
		this.state = {
			value: props.code,
			code: props.code,
			formattedCode: props.code,
			lastStepIsFormat: false,
		};
		window.addEventListener("message", event => {
			if (event.data.command === "formattedCode") {
				const code = event.data.code;
				const panelType = event.data.panel;
				if (panelType === this.props.panel) {
					this.updateCode(code);
				}
			} else if (event.data.command === "formatCode") {
				this.format(this.state.value);
			}
		});
	}

	private handleChange = (event) => {
		this.setState({ value: event.target.value });
	}

	public format(value: string) {
		const element: HTMLTextAreaElement = document.getElementById("noter-text-area") as HTMLTextAreaElement;
		element.readOnly = true;
		if (!this.state.lastStepIsFormat) {
			this.setState({ code: this.state.value });
		}
		formatCode(value, this.props.panel);
		this.setState({ lastStepIsFormat: true });
	}

	private raw() {
		const element: HTMLTextAreaElement = document.getElementById("noter-text-area") as HTMLTextAreaElement;
		element.readOnly = false;
		this.setState({ value: this.state.code, lastStepIsFormat: false });
	}

	public updateCode(code: string) {
		this.setState({ value: code });
	}

	render() {
		return (
			<div id="root">
				<form id="noter-save-form" method="POST">
					<textarea id="noter-text-area" className="md-textarea form-control form-control-lg" rows={15} name="textarea" value={this.state.value} onChange={this.handleChange} />
				</form>
				<div className="row">
					<div className="col-lg-12">
						<button onClick={() => this.format(this.state.value)} id="btnFormat" className="btn btn-primary mr-2 float-right" title="Format Code">Format Code</button>
						<button onClick={() => this.raw()} id="btnRaw" className="btn btn-primary mr-2 float-right" title="Edit Raw Code" disabled={!this.state.lastStepIsFormat}>Edit Raw Code</button>
					</div>
				</div>
			</div>
		);
	}
}
