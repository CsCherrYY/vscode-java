import * as _ from "lodash";
import "bootstrap/js/src/tab";
import * as $ from "jquery";
import * as React from "react";
import * as ReactDOM from "react-dom";
import "../css/vscode.scss";
import { JavaFormatterSetting, JavaFormatterSettingType } from ".";
import { changeSettingBoolean, changeSettingString, formatCodeOnDidChangeSettings } from "./vscode.api";

const handleChange = (e) => {
	const checked = e.target.checked;  // for boolean, boolean
	const value = e.target.value; // for value, string
	const id = e.target.id;
	const className = e.target.className;  // "form-control" or "form-check-input"
	if (className === "form-control") { // enum
		changeSettingString(id, value);
	} else if (className === "form-check-input") {
		changeSettingBoolean(id, checked);
	}
};

export function generateSettingsLeaf(setting: JavaFormatterSetting) {
	if (!setting.name || !setting.id || !setting.type || !setting.defaultValue) {
		return;
	}
	switch (setting.type) {
		case JavaFormatterSettingType.BOOLEAN:
			return (
				<div className="form-check">
					<input type="checkbox" className="form-check-input" id={setting.id} defaultChecked={(setting.defaultValue === "true")} onChange={handleChange}></input>
					<label className="form-check-label" htmlFor={setting.id}>{setting.name}</label>
				</div>
			);
		case JavaFormatterSettingType.ENUM:
			const candidates = setting.candidates.map((entry, index) => {
				if (entry === setting.defaultValue) {
					return (<option selected={true}>{entry}</option>);
				} else {
					return (<option>{entry}</option>);
				}
			});
			return (
				<div className="input-group mb-3">
					<div className="input-group-prepend">
						<label className="input-group-text" htmlFor="invisible">{setting.name}</label>
					</div>
					<select className="form-control" id={setting.id} onChange={handleChange}>
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

export function generateSettings(setting: JavaFormatterSetting[], filterValue?: string) {
	if (!setting) {
		return;
	}
	const result = setting.map((value, index) => {
		if (filterValue && value.name.toLowerCase().indexOf(filterValue.toLowerCase()) === -1) {
			return;
		}
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