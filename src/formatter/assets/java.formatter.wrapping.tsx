
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

export interface WrappingSettingsProps {
	filterValue: string;
	wrappingSettings?: JavaFormatterSetting[];
}

export interface WrappingSettingsStates {
	wrappingSettings?: JavaFormatterSetting[];
}

export class WrappingSettingsPanel extends React.Component<WrappingSettingsProps, WrappingSettingsStates> {
	child: any;

	constructor(props: WrappingSettingsProps) {
		super(props);
		this.state = { wrappingSettings: props.wrappingSettings };
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

	private test: string = `class Example \{\n\tprivate int[] array1 = new int[] { 1, 2, 3};\n\t@interface MyAnnotation {\n\t\tString value();\n\t}\n\tString s = ((String)object);\n\tx.<String, Element>foo();\n\}`;

	private WrappingPreviewPanel = React.createElement(CodePreviewPanel, { code: this.test, panel: JavaFormatterSettingPanel.WRAPPING });

	render() {

		return (
			<div className="col">
				<div className="row">
					<div className="col-6">
						<div className="row">
							<h2 className="font-weight-light col-10">Wrapping</h2>
							<div className="row">
								<button id="btnCollapse" className="btn btn-link btn-sm" title="Collapse All" >Collapse All</button>
							</div>
						</div>
						<div>{generateSettings(this.state.wrappingSettings, this.props.filterValue)}</div>
					</div>
					<div className="col-6">
						<h2 className="font-weight-light">Preview</h2>
						{this.WrappingPreviewPanel}
					</div>
				</div>
			</div>
		);
	}
}
