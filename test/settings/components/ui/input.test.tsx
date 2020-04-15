import React from "react";
import ReactDOM from "react-dom";
import ReactTestUtils from "react-dom/test-utils";
import Input from "../../../../src/settings/components/ui/Input";
import { expect } from "chai";

describe("settings/ui/Input", () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  context("type=text", () => {
    it("renders text input", () => {
      ReactTestUtils.act(() => {
        ReactDOM.render(
          <Input type="text" name="myname" label="myfield" value="myvalue" />,
          container
        );
      });

      const label = document.querySelector("label")!!;
      const input = document.querySelector("input")!!;
      expect(label.textContent).to.contain("myfield");
      expect(input.type).to.contain("text");
      expect(input.name).to.contain("myname");
      expect(input.value).to.contain("myvalue");
    });

    it("invoke onChange", (done) => {
      ReactTestUtils.act(() => {
        ReactDOM.render(
          <Input
            type="text"
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

      const input = document.querySelector("input")!!;
      input.value = "newvalue";
      ReactTestUtils.Simulate.change(input);
    });
  });

  context("type=radio", () => {
    it("renders radio button", () => {
      ReactTestUtils.act(() => {
        ReactDOM.render(
          <Input type="radio" name="myname" label="myfield" value="myvalue" />,
          container
        );
      });

      const label = document.querySelector("label")!!;
      const input = document.querySelector("input")!!;
      expect(label.textContent).to.contain("myfield");
      expect(input.type).to.contain("radio");
      expect(input.name).to.contain("myname");
      expect(input.value).to.contain("myvalue");
    });

    it("invoke onChange", (done) => {
      ReactTestUtils.act(() => {
        ReactDOM.render(
          <Input
            type="text"
            name="radio"
            label="myfield"
            value="myvalue"
            onChange={(e) => {
              expect((e.target as HTMLInputElement).checked).to.be.true;
              done();
            }}
          />,
          container
        );
      });

      const input = document.querySelector("input") as HTMLInputElement;
      input.checked = true;
      ReactTestUtils.Simulate.change(input);
    });
  });

  context("type=textarea", () => {
    it("renders textarea button", () => {
      ReactTestUtils.act(() => {
        ReactDOM.render(
          <Input
            type="textarea"
            name="myname"
            label="myfield"
            value="myvalue"
            error="myerror"
          />,
          container
        );
      });

      const label = document.querySelector("label")!!;
      const textarea = document.querySelector("textarea")!!;
      const error = document.querySelector(".settings-ui-input-error")!!;
      expect(label.textContent).to.contain("myfield");
      expect(textarea.nodeName).to.contain("TEXTAREA");
      expect(textarea.name).to.contain("myname");
      expect(textarea.value).to.contain("myvalue");
      expect(error.textContent).to.contain("myerror");
    });

    it("invoke onChange", (done) => {
      ReactTestUtils.act(() => {
        ReactDOM.render(
          <Input
            type="textarea"
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

      const input = document.querySelector("textarea")!!;
      input.value = "newvalue";
      ReactTestUtils.Simulate.change(input);
    });
  });
});
