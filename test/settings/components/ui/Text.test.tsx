import React from "react";
import ReactDOM from "react-dom";
import ReactTestUtils from "react-dom/test-utils";
import Text from "../../../../src/settings/components/ui/Text";
import { expect } from "chai";

describe("settings/ui/Text", () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it("renders text input", () => {
    ReactTestUtils.act(() => {
      ReactDOM.render(
        <Text name="myname" label="myfield" value="myvalue" />,
        container
      );
    });

    const label = document.querySelector("label")!;
    const input = document.querySelector("input")!;
    expect(label.textContent).to.contain("myfield");
    expect(input.type).to.contain("text");
    expect(input.name).to.contain("myname");
    expect(input.value).to.contain("myvalue");
  });

  it("invoke onChange", (done) => {
    ReactTestUtils.act(() => {
      ReactDOM.render(
        <Text
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

    const input = document.querySelector("input")!;
    input.value = "newvalue";
    ReactTestUtils.Simulate.change(input);
  });
});
