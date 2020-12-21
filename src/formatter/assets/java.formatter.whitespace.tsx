
import * as _ from "lodash";
import "bootstrap/js/src/tab";
import * as $ from "jquery";
import * as React from "react";
import * as ReactDOM from "react-dom";
import "../css/vscode.scss";
import { JavaFormatterSetting, JavaFormatterSettingType } from ".";
import { formatCode } from "./vscode.api";
import { CodePreviewPanel } from "./java.formatter.code";
import { settings } from "cluster";

export interface WhitespaceSettingsProps {
  whitespaceSettings?: JavaFormatterSetting;
}

export class WhitespaceSettingsPanel extends React.Component<WhitespaceSettingsProps> {

  constructor(props: WhitespaceSettingsProps) {
    super(props);
  }

  private test: readonly string = "class MyClass \{int a = 0,b = 1,c = 2,d = 3;\}";

  private generateSettingsLeaf(setting: JavaFormatterSetting) {
    if (!setting.name || !setting.id || !setting.type || !setting.defaultValue) {
      return;
    }
    switch (setting.type) {
      case JavaFormatterSettingType.BOOLEAN:
        return (
          <div className="form-check">
            <input type="checkbox" className="form-check-input" id={setting.id}></input>
            <label className="form-check-label" htmlFor={setting.id}>{setting.name}</label>
          </div>
        );
      case JavaFormatterSettingType.ENUM:
        const candidates = setting.candidates.map((entry, index) => {
          return (<option>{entry}</option>);
        });
        return (
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <label className="input-group-text" htmlFor="invisible">{setting.name}</label>
            </div>
            <select className="form-control" id={setting.id} defaultValue={setting.defaultValue}>
              {candidates}
            </select>
          </div>
        );
      case JavaFormatterSettingType.NUMBER:
        return;
      default:
        return;
    }
  }

  private generateSettings(setting: JavaFormatterSetting) {
    if (setting === undefined) {
      return;
    }
    if (!setting.children) {
      return this.generateSettingsLeaf(setting);
    } else {
      const settings = setting.children.map((entry, index) => {
        return this.generateSettings(entry);
      });
      return (
        <details>
          <summary>{setting.name}</summary>
          {settings}
        </details>
      );
    }
    return;
  }

  render() {
    return (this.generateSettings(this.props.whitespaceSettings));
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
            <div className="col">
              <details>
                <summary>Operators</summary>
                <div className="form-check">
                  <input type="checkbox" className="form-check-input" id="beforeBinaryOperator"></input>
                  <label className="form-check-label" htmlFor="beforeBinaryOperator">Insert Whitespace Before binary operator</label>
                </div>
                <div className="form-check">
                  <input type="checkbox" className="form-check-input" id="afterBinaryOperator"></input>
                  <label className="form-check-label" htmlFor="afterBinaryOperator">Insert Whitespace After binary operator</label>
                </div>
              </details>
              <details>
                <summary>Comma</summary>
                <div className="form-check">
                  <input type="checkbox" className="form-check-input" id="beforeComma"></input>
                  <label className="form-check-label" htmlFor="beforeComma">Insert Whitespace Before comma</label>
                </div>
                <div className="form-check">
                  <input type="checkbox" className="form-check-input" id="afterComma"></input>
                  <label className="form-check-label" htmlFor="afterComma">Insert Whitespace After comma</label>
                </div>
              </details>
              <details>
                <summary>Parenthesis</summary>
                <div className="form-check">
                  <input type="checkbox" className="form-check-input" id="beforeClosingParenthesis"></input>
                  <label className="form-check-label" htmlFor="beforeClosingParenthesis">Insert Whitespace Before Closing Parenthesis</label>
                </div>
                <div className="form-check">
                  <input type="checkbox" className="form-check-input" id="beforeOpeningParenthesis"></input>
                  <label className="form-check-label" htmlFor="beforeOpeningParenthesis">Insert Whitespace Before Opening Parenthesis</label>
                </div>
                <div className="form-check">
                  <input type="checkbox" className="form-check-input" id="afterOpeningParenthesis"></input>
                  <label className="form-check-label" htmlFor="afterOpeningParenthesis">Insert Whitespace After Opening Parenthesis</label>
                </div>
              </details>
              <details>
                <summary>Braces</summary>
                <div className="form-check">
                  <input type="checkbox" className="form-check-input" id="beforeOpeningBrace"></input>
                  <label className="form-check-label" htmlFor="beforeOpeningBrace">Insert Whitespace Before Opening Brace</label>
                </div>
              </details>
            </div>
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
