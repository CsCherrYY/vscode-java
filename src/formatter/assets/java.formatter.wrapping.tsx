import * as _ from "lodash";
import "bootstrap/js/src/tab";
import * as $ from "jquery";
import * as React from "react";
import * as ReactDOM from "react-dom";
import "../css/vscode.scss";
import { JavaFormatterSetting, JavaFormatterSettingPanel } from ".";
import { CodePreviewPanel } from "./java.formatter.code";
import { generateSettings } from "./utils";

export interface WrappingSettingsProps {
	filterValue: string;
  wrappingSettings?: JavaFormatterSetting[];
}

export interface WrappingSettingsState {
	wrappingSettings?: JavaFormatterSetting[];
  }

export class WrappingSettingsPanel extends React.Component<WrappingSettingsProps, WrappingSettingsState> {

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

  private test: string = "class MyClass \{int a = 0,b = 1,c = 2,d = 3;\}";

  private wrappingPreviewPanel = React.createElement(CodePreviewPanel, { code: this.test, panel: JavaFormatterSettingPanel.WRAPPING });

  render() {
    return (
      <div className="col">
        <div className="row">
          <div className="col-6">
            <h2 className="font-weight-light">Wrapping</h2>
            {generateSettings(this.props.wrappingSettings, this.props.filterValue)}
          </div>
          <div className="col-6">
            <h2 className="font-weight-light">Preview</h2>
            {this.wrappingPreviewPanel}
          </div>
        </div>
      </div>
    );
  }
}
