import "bootstrap/js/src/tab";
import "bootstrap/js/src/collapse";
import "bootstrap/js/src/dropdown";
import * as $ from "jquery";
import * as React from "react";
import * as ReactDOM from "react-dom";
import "../css/vscode.scss";
import { JavaFormatterPanel } from "./java.formatter";
import { FormatterSettingConstants } from "../FormatterSettingConstants";

export enum JavaFormatterSettingPanel {
	WHITESPACE = "whiteSpace",
	COMMENT = "comment",
	WRAPPING = "wrapping",
}

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
	const props = {
		whitespaceSettings: initializeWhitespaceSettings(),
		commentSettings: initializeCommentSettings(),
		wrappingSettings: initializeWrappingSettings(),
	};

	ReactDOM.render(React.createElement(JavaFormatterPanel, props), document.getElementById("formatterPanel"));

	$("a.navigation").click(e => {
		($($(e.target).attr("href") || "") as any).tab("show");
	});

}

render();

function initializeWrappingSettings(): JavaFormatterSetting[] {

	const wrappingSettings: JavaFormatterSetting[] = [];

	const bracePolicySetting: JavaFormatterSetting = {
		name: "Brace Policy",
		id: "java.format.insertLine.brace",
		type: JavaFormatterSettingType.ENUM,
		candidates: ["Same line", "Next line"],
		defaultValue: "Same line"
	};

	const bracedCodeSetting: JavaFormatterSetting = {
		name: "Braced Code",
		id: "java.format.insertLine.bracedCode",
		type: JavaFormatterSettingType.ENUM,
		candidates: ["Never", "If empty", "If at most one item"],
		defaultValue: "Never"
	};

	const newLineInControlStatementSetting: JavaFormatterSetting = {
		name: "New Line in Control Statement",
		id: "java.format.insertLine.controlStatement",
		type: JavaFormatterSettingType.BOOLEAN,
		defaultValue: "false"
	};

	const KeepSimpleInControlStatementSetting: JavaFormatterSetting = {
		name: "Keep simple Control Statement",
		id: "java.format.insertLine.controlStatement.keepSimple",
		type: JavaFormatterSettingType.BOOLEAN,
		defaultValue: "true"
	};

	wrappingSettings.push(...[bracePolicySetting, bracedCodeSetting, newLineInControlStatementSetting, KeepSimpleInControlStatementSetting]);

	return wrappingSettings;
}

function initializeCommentSettings(): JavaFormatterSetting[] {

	const commentSettings: JavaFormatterSetting[] = [];

	const javadocAlignmentSetting: JavaFormatterSetting = {
		name: "Javadoc Alignment",
		id: "java.format.comments.javadoc.alignment",
		type: JavaFormatterSettingType.ENUM,
		candidates: ["Align names and descriptions", "Align descriptions, grouped by type", "Align descriptions to tag width", "Don’t align"],
		defaultValue: "Align descriptions, grouped by type"
	};

	const offOnTagsSetting: JavaFormatterSetting = {
		name: "Use Off/On Tags",
		id: "java.format.comments.offOnTag",
		type: JavaFormatterSettingType.BOOLEAN,
		defaultValue: "false"
	};

	commentSettings.push(...[javadocAlignmentSetting, offOnTagsSetting]);

	return commentSettings;
}

function initializeWhitespaceSettings(): JavaFormatterSetting[] {

	const whitespaceSettings: JavaFormatterSetting[] = [];

	const operatorSetting: JavaFormatterSetting = {
		name: "Operator",
		id: "operator",
	};

	const beforeBinaryOperatorSetting: JavaFormatterSetting = {
		name: "Insert Whitespace Before Binary Operator",
		id: FormatterSettingConstants.BEFORE_BINARY_OPERATOR,
		type: JavaFormatterSettingType.BOOLEAN,
		defaultValue: "true"
	};

	const afterBinaryOperatorSetting: JavaFormatterSetting = {
		name: "Insert Whitespace After Binary Operator",
		id: FormatterSettingConstants.AFTER_BINARY_OPERATOR,
		type: JavaFormatterSettingType.BOOLEAN,
		defaultValue: "true"
	};

	operatorSetting.children = [beforeBinaryOperatorSetting, afterBinaryOperatorSetting];

	const commaSetting: JavaFormatterSetting = {
		name: "Comma",
		id: "comma",
	};

	const beforeCommaSetting: JavaFormatterSetting = {
		name: "Insert Whitespace Before Comma",
		id: FormatterSettingConstants.BEFORE_COMMA,
		type: JavaFormatterSettingType.BOOLEAN,
		defaultValue: "false"
	};

	const afterCommaSetting: JavaFormatterSetting = {
		name: "Insert Whitespace After Comma",
		id: FormatterSettingConstants.AFTER_COMMA,
		type: JavaFormatterSettingType.BOOLEAN,
		defaultValue: "true"
	};

	commaSetting.children = [beforeCommaSetting, afterCommaSetting];

	const parenthesisSetting: JavaFormatterSetting = {
		name: "Parenthesis",
		id: "parenthesis",
	};

	const beforeClosingParenthesisSetting: JavaFormatterSetting = {
		name: "Insert Whitespace Before Closing Parenthesis",
		id: FormatterSettingConstants.BEFORE_CLOSING_PARENTHESIS,
		type: JavaFormatterSettingType.BOOLEAN,
		defaultValue: "false"
	};

	const beforeOpeningParenthesisSetting: JavaFormatterSetting = {
		name: "Insert Whitespace Before Opening Parenthesis",
		id: FormatterSettingConstants.BEFORE_CLOSING_PARENTHESIS_CONTROL,
		type: JavaFormatterSettingType.BOOLEAN,
		defaultValue: "true"
	};

	const afterOpeningParenthesisSetting: JavaFormatterSetting = {
		name: "Insert Whitespace After Opening Parenthesis",
		id: FormatterSettingConstants.AFTER_OPENING_PARENTHESIS,
		type: JavaFormatterSettingType.BOOLEAN,
		defaultValue: "false"
	};

	parenthesisSetting.children = [beforeClosingParenthesisSetting, beforeOpeningParenthesisSetting, afterOpeningParenthesisSetting];

	const bracesSetting: JavaFormatterSetting = {
		name: "Brace",
		id: "brace",
	};

	const beforeOpeningBraceSetting: JavaFormatterSetting = {
		name: "Insert Whitespace Before Opening Brace",
		id: FormatterSettingConstants.OPENING_BRACE,
		type: JavaFormatterSettingType.BOOLEAN,
		defaultValue: "true"
	};

	bracesSetting.children = [beforeOpeningBraceSetting];

	whitespaceSettings.push(...[operatorSetting, commaSetting, parenthesisSetting, bracesSetting]);

	return whitespaceSettings;
}