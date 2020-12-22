import * as _ from "lodash";
import "bootstrap/js/src/tab";
import * as $ from "jquery";
import * as React from "react";
import * as ReactDOM from "react-dom";
import "../css/vscode.scss";
import { JavaFormatterSetting, JavaFormatterSettingType } from ".";

export function generateSettingsLeaf(setting: JavaFormatterSetting) {
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
          <select className="form-control" id={setting.id} defaultChecked={(setting.defaultValue === "true")}>
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

export function generateSettings(setting: JavaFormatterSetting[]) {
  if (!setting) {
    return;
  }
  const result = setting.map((value, index) => {
    if (!value.children) {
      return this.generateSettingsLeaf(value);
    } else {
      const settings = this.generateSettings(value.children);
      return (
        <details>
          <summary>{value.name}</summary>
          {settings}
        </details>
      );
    }
  });
  return result;
}