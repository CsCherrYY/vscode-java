import "bootstrap/js/src/tab";
import "bootstrap/js/src/collapse";
import "bootstrap/js/src/dropdown";
import * as $ from "jquery";
import * as React from "react";
import * as ReactDOM from "react-dom";
import "../css/vscode.scss";
import { JavaFormatterPanel } from "./java.formatter";

export enum JavaFormatterSettingType {
  BOOLEAN = "boolean",
  NUMBER = "number",
  ENUM = "enum",
}

export interface JavaFormatterSetting {
  name: string;
  id: string;
  // Valid types: boolean, string, number and enum
  type?: JavaFormatterSettingType;
  defaultValue?: string;
  candidates?: string[];
  // For leaf node, children === undefined
  children?: JavaFormatterSetting[];
}

function render() {
  const a: JavaFormatterSetting = {
    name: "whitespace1", type: JavaFormatterSettingType.BOOLEAN, defaultValue: "false", id: "wte",
  };
  const a1: JavaFormatterSetting = {
    name: "whitespace2", type: JavaFormatterSettingType.BOOLEAN, defaultValue: "false", id: "wte",
  };
  const a2: JavaFormatterSetting = {
    name: "whitespace3", type: JavaFormatterSettingType.BOOLEAN, defaultValue: "false", id: "wte",
  };
  const a3: JavaFormatterSetting = {
    name: "whitespace4", type: JavaFormatterSettingType.BOOLEAN, defaultValue: "false", id: "wte",
  };
  a.children = [a1];
  a1.children = [a2, a3];
  const b: JavaFormatterSetting = {
    name: "whitespace2", type: JavaFormatterSettingType.NUMBER, defaultValue: "123", id: "wte",
  };
  const c: JavaFormatterSetting = {
    name: "comments1", type: JavaFormatterSettingType.NUMBER, defaultValue: "123", id: "wte",
  };
  const d: JavaFormatterSetting = {
    name: "newLine1", type: JavaFormatterSettingType.NUMBER, defaultValue: "123", id: "wte",
  };
  const whitespaceSettings: JavaFormatterSetting = a;
  const commentSettings: JavaFormatterSetting = c;
  const newLineSettings: JavaFormatterSetting = d;
  const props = {
    whitespaceSettings: whitespaceSettings,
    commentSettings: commentSettings,
    newLineSettings: newLineSettings,
  };

  ReactDOM.render(React.createElement(JavaFormatterPanel, props), document.getElementById("formatterPanel"));

  $("a.navigation").click(e => {
    ($($(e.target).attr("href") || "") as any).tab("show");
  });

}

render();
