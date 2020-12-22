import * as _ from "lodash";
import "bootstrap/js/src/tab";
import * as $ from "jquery";
import * as React from "react";
import * as ReactDOM from "react-dom";
import "../css/vscode.scss";
import { JavaFormatterSetting } from ".";
import { CodePreviewPanel } from "./java.formatter.code";
import { generateSettings } from "./utils";

export interface CommentSettingsProps {
  commentSettings?: JavaFormatterSetting[];
}

export class CommentSettingsPanel extends React.Component<CommentSettingsProps> {

  constructor(props: CommentSettingsProps) {
    super(props);
  }

  private test: string = "\t/**\n\t * Descriptions of parameters and return values\n\
  \t * are best appended at end of the javadoc\n\
  \t * comment.\n\
  \t * @param first  The first parameter. For an\n\
  \t * optimum result, this should be an odd\n\
  \t * number between 0 and 100.\n\
  \t */\n\
  \t int foo(int first, int second)\n\t \tthrows Exception;";

  render() {
    return (
      <div className="col">
        <div className="row">
          <div className="col-6">
            <h2 className="font-weight-light">Comment</h2>
            {generateSettings(this.props.commentSettings)}
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
