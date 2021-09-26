/**
 * @jest-environment jsdom
 */

import React from "react";
import ReactDOM from "react-dom";
import ReactTestUtils from "react-dom/test-utils";
import TextArea from "../../../../src/settings/components/ui/TextArea";

describe("settings/ui/TextArea", () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it("renders textarea", () => {
    ReactTestUtils.act(() => {
      ReactDOM.render(
        <TextArea
          name="myname"
          label="myfield"
          value="myvalue"
          error="myerror"
        />,
        container
      );
    });

    const label = document.querySelector("label")!;
    const textarea = document.querySelector("textarea")!;
    const error = document.querySelector("[role=alert]")!;
    expect(label.textContent).toEqual("myfield");
    expect(textarea.nodeName).toEqual("TEXTAREA");
    expect(textarea.name).toEqual("myname");
    expect(textarea.value).toEqual("myvalue");
    expect(error.textContent).toEqual("myerror");
  });

  it("invoke onChange", (done) => {
    ReactTestUtils.act(() => {
      ReactDOM.render(
        <TextArea
          name="myname"
          label="myfield"
          value="myvalue"
          onChange={(e) => {
            expect((e.target as HTMLTextAreaElement).value).toEqual("newvalue");
            done();
          }}
        />,
        container
      );
    });

    const input = document.querySelector("textarea")!;
    input.value = "newvalue";
    ReactTestUtils.Simulate.change(input);
  });
});
