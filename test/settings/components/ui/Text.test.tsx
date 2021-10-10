/**
 * @jest-environment jsdom
 */

import React from "react";
import ReactDOM from "react-dom";
import ReactTestUtils from "react-dom/test-utils";
import Text from "../../../../src/settings/components/ui/Text";

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
    expect(label.textContent?.includes("myfield")).toBeTruthy;
    expect(input.type).toEqual("text");
    expect(input.name).toEqual("myname");
    expect(input.value).toEqual("myvalue");
  });

  it("invoke onChange", (done) => {
    ReactTestUtils.act(() => {
      ReactDOM.render(
        <Text
          name="myname"
          label="myfield"
          value="myvalue"
          onChange={(e) => {
            expect((e.target as HTMLInputElement).value).toEqual("newvalue");
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
