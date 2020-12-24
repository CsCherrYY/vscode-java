import * as _ from "lodash";
import "bootstrap/js/src/tab";
import * as $ from "jquery";
import * as React from "react";
import * as ReactDOM from "react-dom";
import "../css/vscode.scss";
import { JavaFormatterSetting, JavaFormatterSettingPanel } from ".";
import { CodePreviewPanel } from "./java.formatter.code";
import { generateSettings } from "./utils";

export interface CommentSettingsProps {
	filterValue: string;
	commentSettings?: JavaFormatterSetting[];
}

export interface CommentSettingsState {
	commentSettings?: JavaFormatterSetting[];
}

export class CommentSettingsPanel extends React.Component<CommentSettingsProps, CommentSettingsState> {

	constructor(props: CommentSettingsProps) {
		super(props);
		this.state = { commentSettings: props.commentSettings };
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

	private test: string = "class MyClass \{\n\t/**\n\t * Descriptions of parameters and return values\n\
\t * are best appended at end of the javadoc\n\
\t * comment.\n\
\t * @param x The first parameter. For an\n\
\t * optimum result, this should be an odd\n\
\t * number between 0 and 100.\n\
\t */\n\
\t public int foo(int first, int second){\n\t \tthrows Exception;}\n\}";


	private commentPreviewPanel = React.createElement(CodePreviewPanel, { code: this.test, panel: JavaFormatterSettingPanel.COMMENT });

	render() {
		return (
			<div className="col">
				<div className="row">
					<div className="col-6">
						<h2 className="font-weight-light">Comment</h2>
						{generateSettings(this.props.commentSettings, this.props.filterValue)}
					</div>
					<div className="col-6">
						<h2 className="font-weight-light">Preview</h2>
						{this.commentPreviewPanel}
					</div>
				</div>
			</div>
		);
	}
}
