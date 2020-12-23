
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

export interface WhitespaceSettingsProps {
  whitespaceSettings?: JavaFormatterSetting[];
}

export class WhitespaceSettingsPanel extends React.Component<WhitespaceSettingsProps> {

  constructor(props: WhitespaceSettingsProps) {
    super(props);
  }

  private test: string = "class MyClass \{int a = 0,b = 1,c = 2,d = 3;\}";

  render() {
    return (
      <div className="col">
        <div className="row">
          <div className="col-6">
            <div className="row">
              <h2 className="font-weight-light col-10">WhiteSpace</h2>
              <div className="row">
                <button id="btnCollapse" className="btn btn-link btn-sm" title="Collapse All" >Collapse All</button>
              </div>
            </div>
            <div>{generateSettings(this.props.whitespaceSettings)}</div>
          </div>
          <div className="col-6">
            <h2 className="font-weight-light">Preview</h2>
            <CodePreviewPanel code={this.test} />
          </div>
        </div>
      </div>
    );
  }
}

export function baz(test: string) {
  formatCode(test);
}
