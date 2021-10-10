/**
 * @jest-environment jsdom
 */

import React from "react";
import ReactDOM from "react-dom";
import ReactTestUtils from "react-dom/test-utils";
import Radio from "../../../../src/settings/components/ui/Radio";

describe("settings/ui/Radio", () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it("renders radio button", () => {
    ReactTestUtils.act(() => {
      ReactDOM.render(
        <Radio name="myradio" label="myfield" value="myvalue" />,
        container
      );
    });

    const label = document.querySelector("label")!;
    const input = document.querySelector("input")!;
    expect(label.textContent).toEqual("myfield");
    expect(input.type).toEqual("radio");
    expect(input.name).toEqual("myradio");
    expect(input.value).toEqual("myvalue");
  });

  it("invoke onChange", (done) => {
    ReactTestUtils.act(() => {
      ReactDOM.render(
        <Radio
          name="myradio"
          type="text"
          label="myfield"
          value="myvalue"
          onChange={(e) => {
            expect((e.target as HTMLInputElement).checked).toBeTruthy;
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
