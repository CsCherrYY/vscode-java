
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

	private test: string = "class MyClass \{private int a = 0,b = 11,c = 2,d = 3;\nprivate int aa = -4 + -9;\nprivate int bb = aa++ / --number;\npublic void bar(int x, int y){}\n\}";

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
