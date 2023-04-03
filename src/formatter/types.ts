// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

export interface JavaFormatterSettingMetadata {
    id: string;
    defaultValue: string;
    description: string;
    value?: any;
    category: Category;
    exampleKind: ExampleKind;
    valueKind: ValueKind;
}

export enum ValueKind {
    booleanValue,
    numberValue,
    stringValue,
    enumValue,
    alignmentValue,
}

export interface Value {
    value: string;
    description?: string;
}

export enum Category {
    indentation,
    whitespace,
    comment,
    wrapping,
    insertLine,
    blankLine,
}

export enum ExampleKind {
    indentation = "Indentation",
    blankLine = "Blank line",
    comment = "Comment",
    insertLine = "Insert Line",
    bracedType = "Braced type",
    bracedRecord = "Braced record",
    bracedEnum = "Braced enum",
    annotationAndAnonymous = "Annotation and anonymous",
    whitespace = "Whitespace",
    wrapping = "Wrapping",
}

// two extra properties from @xmldom/xmldom package, see https://www.npmjs.com/package/@xmldom/xmldom
export interface DOMElement extends Element {
    lineNumber: number;
    columnNumber: number;
}

export interface DOMAttr extends Attr {
    lineNumber: number;
    columnNumber: number;
}

export interface ProfileContent {
    isValid: boolean;
    settingsVersion: string;
    supportedProfileSettings?: Map<string, JavaFormatterSettingMetadata>;
}
