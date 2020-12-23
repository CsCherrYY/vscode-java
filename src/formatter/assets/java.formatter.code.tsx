import * as _ from "lodash";
import "bootstrap/js/src/tab";
import * as $ from "jquery";
import * as React from "react";
import * as ReactDOM from "react-dom";
import "../css/vscode.scss";
import { formatCode } from "./vscode.api";

const code = "class MyClass \{\n\tint a = 0, b = 1, c = 2, d = 3;\n\}";
interface CodePreviewPanelProps {
  code: string;
}

interface CodePreviewPanelStates {
  value: string;
}
export class CodePreviewPanel extends React.Component<CodePreviewPanelProps, CodePreviewPanelStates> {

  constructor(props: CodePreviewPanelProps) {
    super(props);
    this.state = {
      value: props.code,
    };
  }

  private handleChange = (event) => {
    this.setState({ value: event.target.value });
  }

  private format(value: string) {
    const element: HTMLTextAreaElement = document.getElementById("noter-text-area") as HTMLTextAreaElement;
    element.readOnly = true;
    formatCode(value);
  }

  private raw(value: string) {
    const element: HTMLTextAreaElement = document.getElementById("noter-text-area") as HTMLTextAreaElement;
    element.readOnly = false;
    this.setState({ value: "class MyClass \{int a = 0,b = 1,c = 2,d = 3;\}" });
  }

  render() {
    return (
      <div id="root">
        <form id="noter-save-form" method="POST">
          <textarea id="noter-text-area" className="md-textarea form-control form-control-lg" rows={15} name="textarea" value={this.state.value} onChange={this.handleChange} />
        </form>
        <div className="row">
          <div className="col-lg-12">
            <button onClick={() => this.format(this.state.value)} id="btnFormat" className="btn btn-primary mr-2 float-right" title="Format Code">Format Code</button>
            <button onClick={() => this.raw(this.state.value)} id="btnRaw" className="btn btn-primary mr-2 float-right" title="Edit Raw Code">Edit Raw Code</button>
          </div>
        </div>
      </div>
    );
  }
}
