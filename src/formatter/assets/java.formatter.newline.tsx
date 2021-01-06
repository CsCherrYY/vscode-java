
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

export interface NewlineSettingsProps {
	filterValue: string;
	newlineSettings?: JavaFormatterSetting[];
}

export interface NewlineSettingsStates {
	newlineSettings?: JavaFormatterSetting[];
}

export class NewlineSettingsPanel extends React.Component<NewlineSettingsProps, NewlineSettingsStates> {
	child: any;

	constructor(props: NewlineSettingsProps) {
		super(props);
		this.state = { newlineSettings: props.newlineSettings };
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

	private test: string = "class MyClass \{private int a = 0,b = 11,c = 2,d = 3;\nprivate int aa = -4 + -9;\nprivate int bb = aa++ / --number;\npublic void bar(int x, int y){}\n\}";

	private NewlinePreviewPanel = React.createElement(CodePreviewPanel, { code: this.test, panel: JavaFormatterSettingPanel.NEWLINE });

	render() {

		return (
			<div className="col">
				<div className="row">
					<div className="col-6">
						<div className="row">
							<h2 className="font-weight-light col-10">Newline</h2>
							<div className="row">
								<button id="btnCollapse" className="btn btn-link btn-sm" title="Collapse All" >Collapse All</button>
							</div>
						</div>
						<div>{generateSettings(this.state.newlineSettings, this.props.filterValue)}</div>
					</div>
					<div className="col-6">
						<h2 className="font-weight-light">Preview</h2>
						{this.NewlinePreviewPanel}
					</div>
				</div>
			</div>
		);
	}
}
