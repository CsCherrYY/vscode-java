import "bootstrap/js/src/tab";
import * as $ from "jquery";
import * as React from "react";
import * as ReactDOM from "react-dom";
import "../css/vscode.scss";
import { JavaFormatterSetting, JavaFormatterSettingPanel } from ".";
import { CommentSettingsPanel } from "./java.formatter.comment";
import { WrappingSettingsPanel } from "./java.formatter.wrapping";
import { importSettings } from "./vscode.api";
import { WhitespaceSettingsPanel } from "./java.formatter.whitespace";
/*
window.addEventListener("message", event => {
	if (event.data.command === "formattedCode") {
		const code = event.data.code;
		const panelType = event.data.panel;
		switch (panelType) {
			case JavaFormatterSettingPanel.WHITESPACE:
				JavaFormatterPanel.whitespaceSettingsPanel.updateWhitespacePanelCode(code);
				break;
			case JavaFormatterSettingPanel.COMMENT:
				//updateCommentPanelCode(code);
				break;
			case JavaFormatterSettingPanel.WRAPPING:
				//updateWrappingPanelCode(code);
				break;
			default:
				return;
		}
	}
});*/
interface JavaFormatterPanelProps {
	whitespaceSettings?: JavaFormatterSetting[];
	commentSettings?: JavaFormatterSetting[];
	wrappingSettings?: JavaFormatterSetting[];
}

interface JavaFormatterPanelStates {
	filterValue?: string;
}

export class JavaFormatterPanel extends React.Component<JavaFormatterPanelProps, JavaFormatterPanelStates> {

	constructor(props) {
		super(props);
		this.state = {
			filterValue: "",
		};
	}

	importSetting = () => {
		importSettings();
	}

	handleChange(e) {
		this.setState({
			filterValue: e.target.value
		});
	}

	render = () => {

		const whitespaceSettingsPanel = React.createElement(WhitespaceSettingsPanel, {whitespaceSettings: this.props.whitespaceSettings, filterValue: this.state.filterValue});
		const commentSettingsPanel = React.createElement(CommentSettingsPanel, {commentSettings: this.props.commentSettings, filterValue: this.state.filterValue});
		const wrappingSettingsPanel = React.createElement(WrappingSettingsPanel, {wrappingSettings: this.props.wrappingSettings, filterValue: this.state.filterValue});

		return (
			<div>
				<div className="row">
					<div className="col-3">
						<div className="input-group mb-3">
							<div className="input-group-prepend">
								<span className="input-group-text">Filter:</span>
							</div>
							<input type="text" className="form-control" placeholder="Search Settings..." onChange={this.handleChange.bind(this)}></input>
						</div>
					</div>
					<div className="col-5">
						<div className="input-group mb-3">
							<div className="input-group-prepend">
								<label className="input-group-text" htmlFor="invisible">Active Setting:</label>
							</div>
							<select className="form-control" id="activeSetting" >
								<option>Custom</option>
								<option>Java Convention (preset)</option>
							</select>
						</div>
					</div>
					<div className="col-4">
						<button id="btnImport" className="btn btn-primary mr-2 float-right" title="Import Settings from eclipse Java formatter settings profile" onClick={this.importSetting}>Import from Profile...</button>
					</div>
				</div>
				<div className="row">
					<div className="col d-block">
						<ul className="nav nav-tabs mb-3" role="tablist">
							<li className="nav-item">
								<a className="nav-link active" id="whitespace-tab" data-toggle="tab" href="#whitespace-panel"
									role="tab" aria-controls="whitespace-panel" aria-selected="false" title="">Whitespace</a>
							</li>
							<li className="nav-item">
								<a className="nav-link" id="comment-tab" data-toggle="tab" href="#comment-panel"
									role="tab" aria-controls="comment-panel" aria-selected="false" title="">Comment</a>
							</li>
							<li className="nav-item">
								<a className="nav-link" id="wrapping-tab" data-toggle="tab" href="#wrapping-panel"
									role="tab" aria-controls="wrapping-panel" aria-selected="false" title="">Wrapping</a>
							</li>
						</ul>
					</div>
				</div>
				<div className="row">
					<div className="col">
						<div className="tab-content">
							<div className="tab-pane fade show active" id="whitespace-panel" role="tabpanel"
								aria-labelledby="whitespace-tab">
								<div className="row" id="whitespaceSettingsPanel">
									{whitespaceSettingsPanel}
								</div>
							</div>
							<div className="tab-pane fade" id="comment-panel" role="tabpanel"
								aria-labelledby="comment-tab">
								<div className="row" id="commentSettingsPanel">
									{commentSettingsPanel}
								</div>
							</div>
							<div className="tab-pane fade" id="wrapping-panel" role="tabpanel"
								aria-labelledby="wrapping-tab">
								<div className="row" id="wrappingSettingsPanel">
									{wrappingSettingsPanel}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
