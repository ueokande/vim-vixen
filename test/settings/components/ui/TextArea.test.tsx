import React from "react";
import ReactDOM from "react-dom";
import ReactTestUtils from "react-dom/test-utils";
import TextArea from "../../../../src/settings/components/ui/TextArea";
import { expect } from "chai";

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
          type="textarea"
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
    const error = document.querySelector(".settings-ui-input-error")!;
    expect(label.textContent).to.contain("myfield");
    expect(textarea.nodeName).to.contain("TEXTAREA");
    expect(textarea.name).to.contain("myname");
    expect(textarea.value).to.contain("myvalue");
    expect(error.textContent).to.contain("myerror");
  });

  it("invoke onChange", (done) => {
    ReactTestUtils.act(() => {
      ReactDOM.render(
        <TextArea
          name="myname"
          label="myfield"
          value="myvalue"
          onChange={(e) => {
            expect((e.target as HTMLInputElement).value).to.equal("newvalue");
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
