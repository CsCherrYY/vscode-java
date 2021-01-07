
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

export interface CommonSettingsProps {
	filterValue: string;
	commonSettings?: JavaFormatterSetting[];
}

export interface CommonSettingsStates {
	commonSettings?: JavaFormatterSetting[];
}

export class CommonSettingsPanel extends React.Component<CommonSettingsProps, CommonSettingsStates> {
	child: any;

	constructor(props: CommonSettingsProps) {
		super(props);
		this.state = { commonSettings: props.commonSettings };
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

	private test: string = `class Example \{\n\tint[] myArray = { 1, 2, 3, 4, 5, 6 };\n\tString stringWithTabs = "1\t2\t3\t4";\n\tpublic void bar(int x, int y){}\n\}`;

	private CommonPreviewPanel = React.createElement(CodePreviewPanel, { code: this.test, panel: JavaFormatterSettingPanel.COMMON });

	render() {

		return (
			<div className="col">
				<div className="row">
					<div className="col-6">
						<div className="row">
							<h2 className="font-weight-light col-10">Common</h2>
							<div className="row">
								<button id="btnCollapse" className="btn btn-link btn-sm" title="Collapse All" >Collapse All</button>
							</div>
						</div>
						<div>{generateSettings(this.state.commonSettings, this.props.filterValue)}</div>
					</div>
					<div className="col-6">
						<h2 className="font-weight-light">Preview</h2>
						{this.CommonPreviewPanel}
					</div>
				</div>
			</div>
		);
	}
}
