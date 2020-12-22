import * as _ from "lodash";
import "bootstrap/js/src/tab";
import * as $ from "jquery";
import * as React from "react";
import * as ReactDOM from "react-dom";
import "../css/vscode.scss";
import { JavaFormatterSetting } from ".";
import { CodePreviewPanel } from "./java.formatter.code";
import { generateSettings } from "./utils";

export interface WrappingSettingsProps {
  wrappingSettings?: JavaFormatterSetting[];
}

export class WrappingSettingsPanel extends React.Component<WrappingSettingsProps> {

  constructor(props: WrappingSettingsProps) {
    super(props);
  }

  private test: string = "class MyClass \{int a = 0,b = 1,c = 2,d = 3;\}";

  render() {
    return (
      <div className="col">
        <div className="row">
          <div className="col-6">
            <h2 className="font-weight-light">Wrapping</h2>
            {generateSettings(this.props.wrappingSettings)}
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
