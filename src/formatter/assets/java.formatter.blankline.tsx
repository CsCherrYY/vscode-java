
import * as _ from "lodash";
import "bootstrap/js/src/tab";
import * as $ from "jquery";
import * as React from "react";
import * as ReactDOM from "react-dom";
import "../css/vscode.scss";
import { JavaFormatterSetting, JavaFormatterSettingType } from ".";
import { formatCode } from "./vscode.api";
import { CodePreviewPanel } from "./java.formatter.code";
import { generateSettings } from "./utils";
import { JavaFormatterSettingPanel } from "../FormatterSettingConstants";

export interface BlanklineSettingsProps {
	filterValue: string;
	blanklineSettings?: JavaFormatterSetting[];
}

export interface BlanklineSettingsStates {
	blanklineSettings?: JavaFormatterSetting[];
}

export class BlanklineSettingsPanel extends React.Component<BlanklineSettingsProps, BlanklineSettingsStates> {
	child: any;

	constructor(props: BlanklineSettingsProps) {
		super(props);
		this.state = { blanklineSettings: props.blanklineSettings };
		window.addEventListener("message", event => {
			if (event.data.command === "changeSettings") {
				const element = document.getElementById(event.data.id);
				if (!element) {
					return;
				}
				if (element.checked !== event.data.value) {
					element.checked = event.data.value;
				}
			}
		});
	}

	private test: string = `package foo.bar.baz;\n\n/* example comment */\n\nimport java.util.List;\nimport java.util.Arrays;\n\nimport org.eclipse.jdt.core.dom.ASTParser;\n\npublic class Example {\n\tpublic interface ExampleProvider {\n\t\tExample getExample();\n\n\t\tList<Example> getManyExamples();\n\t}\n}`;

	private BlanklinePreviewPanel = React.createElement(CodePreviewPanel, { code: this.test, panel: JavaFormatterSettingPanel.BLANKLINE });

	render() {

		return (
			<div className="col">
				<div className="row">
					<div className="col-6">
						<div className="row">
							<h2 className="font-weight-light col-10">Blankline</h2>
							<div className="row">
								<button id="btnCollapse" className="btn btn-link btn-sm" title="Collapse All" >Collapse All</button>
							</div>
						</div>
						<div>{generateSettings(this.state.blanklineSettings, this.props.filterValue)}</div>
					</div>
					<div className="col-6">
						<h2 className="font-weight-light">Preview</h2>
						{this.BlanklinePreviewPanel}
					</div>
				</div>
			</div>
		);
	}
}
