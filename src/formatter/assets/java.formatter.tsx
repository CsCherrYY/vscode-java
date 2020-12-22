import "bootstrap/js/src/tab";
import * as $ from "jquery";
import * as React from "react";
import * as ReactDOM from "react-dom";
import "../css/vscode.scss";
import { JavaFormatterSetting } from ".";
import { CommentSettingsPanel } from "./java.formatter.comment";
import { WrappingSettingsPanel } from "./java.formatter.wrapping";
import { exportSettings } from "./vscode.api";
import { WhitespaceSettingsPanel } from "./java.formatter.whitespace";

interface JavaFormatterPanelProps {
  whitespaceSettings?: JavaFormatterSetting[];
  commentSettings?: JavaFormatterSetting[];
  wrappingSettings?: JavaFormatterSetting[];
}

export class JavaFormatterPanel extends React.Component<JavaFormatterPanelProps> {

  constructor(props) {
    super(props);
    this.state = {
      filterValue: "",
    };
  }

  exp = () => {
    exportSettings();
  }

  handleChange(e) {
    this.setState({
      filterValue: e.target.value
    });
  }

  render = () => {

    const whitespaceSettingsPanel = React.createElement(WhitespaceSettingsPanel, this.props);
    const commentSettingsPanel = React.createElement(CommentSettingsPanel, this.props);
    const wrappingSettingsPanel = React.createElement(WrappingSettingsPanel, this.props);

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
          <div className="col-9">
            <button id="btnExport" className="btn btn-primary mr-2 float-right" title="Export Settings" onClick={this.exp}>Export</button>
            <button id="btnImport" className="btn btn-primary mr-2 float-right" title="Import Settings from eclipse Java formatter settings profile">Import from Profile...</button>
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
