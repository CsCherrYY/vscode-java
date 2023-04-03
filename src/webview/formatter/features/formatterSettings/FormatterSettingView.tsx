// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

import React, { useEffect } from "react";
import { Col, Container, Nav, Row } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { applyFormatResult, changeActiveCategory, changeReadOnlyState, loadProfileSetting, loadVSCodeSetting } from "./formatterSettingViewSlice";
import { highlight } from "./components/Highlight";
import { Category, ExampleKind } from "../../../../formatter/types";
import Setting from "./components/Setting";
import { renderWhitespace } from "../../whitespace";
import { onWillChangeExampleKind, onWillDownloadAndUse, onWillInitialize } from "../../utils";

// eslint-disable-next-line @typescript-eslint/naming-convention
const FormatterSettingsView = (): JSX.Element => {
  const activeCategory: Category = useSelector((state: any) => state.formatterSettings.activeCategory);
  const contentText: string = useSelector((state: any) => state.formatterSettings.formattedContent);
  const readOnly: boolean = useSelector((state: any) => state.formatterSettings.readOnly);
  const title: string = `Java Formatter Settings${readOnly ? " (Read Only)" : ""}`;

  const dispatch: Dispatch<any> = useDispatch();
  const onClickNaviBar = (element: any) => {
    const activeCategory: Category = Number(element);
    dispatch(changeActiveCategory(activeCategory));
    let exampleKind: ExampleKind = ExampleKind.indentation;
    switch (activeCategory) {
      case Category.blankLine:
        exampleKind = ExampleKind.blankLine;
        break;
      case Category.comment:
        exampleKind = ExampleKind.comment;
        break;
      case Category.indentation:
        exampleKind = ExampleKind.indentation;
        break;
      case Category.insertLine:
        exampleKind = ExampleKind.insertLine;
        break;
      case Category.whitespace:
        exampleKind = ExampleKind.whitespace;
        break;
      case Category.wrapping:
        exampleKind = ExampleKind.wrapping;
        break;
      default:
        exampleKind = ExampleKind.indentation;
    }
    onWillChangeExampleKind(exampleKind);
  };

  const naviBar: JSX.Element = (
    <Nav activeKey={activeCategory} className="setting-nav flex-column" onSelect={onClickNaviBar}>
      <Nav.Item>
        <Nav.Link className="p-0" eventKey={Category.indentation}>Indentation</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link className="p-0" eventKey={Category.blankLine}>Blank Lines</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link className="p-0" eventKey={Category.comment}>Comment</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link className="p-0" eventKey={Category.insertLine}>Insert Line</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link className="p-0" eventKey={Category.whitespace}>Whitespace</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link className="p-0" eventKey={Category.wrapping}>Wrapping</Nav.Link>
      </Nav.Item>
    </Nav>
  );

  const onDidReceiveMessage = (event: any) => {
    if (event.data.command === "formattedContent") {
      dispatch(applyFormatResult(event.data));
    } else if (event.data.command === "loadProfileSetting") {
      dispatch(loadProfileSetting(event.data));
    } else if (event.data.command === "loadVSCodeSetting") {
      dispatch(loadVSCodeSetting(event.data));
    } else if (event.data.command === "changeReadOnlyState") {
      dispatch(changeReadOnlyState(event.data));
    }
  };

  useEffect(() => {
    window.addEventListener("message", onDidReceiveMessage);
    onWillInitialize();
    return () => window.removeEventListener("message", onDidReceiveMessage);
  }, []);

  useEffect(() => {
    renderWhitespace();
  }, [contentText]);

  return (
    <Container className="root d-flex flex-column">
      <Row className="setting-header">
        <Col><h2 className="mb-0">{title}</h2></Col>
        <Col className="flex-grow-0">{readOnly && (<div><a className="btn btn-primary float-right edit-button" role="button" title="Download and edit profile" onClick={() => onWillDownloadAndUse()}>Download and Edit</a></div>)}</Col>
      </Row>
      <Row className="flex-grow-1 d-flex flex-nowrap view-body">
        <Col className="flex-grow-0">{naviBar}</Col>
        <Col className="d-flex view-content">
          <Row className="flex-grow-1 flex-nowrap flex-column flex-lg-row d-flex w-100 h-100">
            <Col className="flex-grow-0 setting-container d-flex flex-row flex-lg-column flex-lg-nowrap">{<Setting />}</Col>
            <Col className="preview-container d-flex">{highlight(contentText)}</Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default FormatterSettingsView;
