/**
 * @jest-environment jsdom
 */

import React from "react";
import ReactDOM from "react-dom";
import ReactTestRenderer from "react-test-renderer";
import ReactTestUtils from "react-dom/test-utils";
import SearchForm from "../../../../src/settings/components/form/SearchForm";
import { FormSearch } from "../../../../src/shared/SettingData";

describe("settings/form/SearchForm", () => {
  describe("render", () => {
    it("renders SearchForm", () => {
      const root = ReactTestRenderer.create(
        <SearchForm
          value={FormSearch.fromJSON({
            default: "google",
            engines: [
              ["google", "google.com"],
              ["yahoo", "yahoo.com"],
            ],
          })}
        />
      ).root;

      const names = root
        .findAllByType("input")
        .filter((instance) => instance.props.name === "name");
      expect(names).toHaveLength(2);
      expect(names[0].props.value).toEqual("google");
      expect(names[1].props.value).toEqual("yahoo");

      const urls = root
        .findAllByType("input")
        .filter((instance) => instance.props.name === "url");
      expect(urls).toHaveLength(2);
      expect(urls[0].props.value).toEqual("google.com");
      expect(urls[1].props.value).toEqual("yahoo.com");
    });
  });

  describe("onChange event", () => {
    let container: HTMLDivElement;

    beforeEach(() => {
      container = document.createElement("div");
      document.body.appendChild(container);
    });

    afterEach(() => {
      document.body.removeChild(container);
    });

    it("invokes onChange event on edit", (done) => {
      ReactTestUtils.act(() => {
        ReactDOM.render(
          <SearchForm
            value={FormSearch.fromJSON({
              default: "google",
              engines: [
                ["google", "google.com"],
                ["yahoo", "yahoo.com"],
              ],
            })}
            onChange={(value) => {
              const json = value.toJSON();
              expect(json.default).toEqual("louvre");
              expect(json.engines).toHaveLength(2);
              expect(json.engines).toEqual([
                ["louvre", "google.com"],
                ["yahoo", "yahoo.com"],
              ]);
              done();
            }}
          />,
          container
        );
      });

      const radio = document.querySelector(
        "input[type=radio]"
      ) as HTMLInputElement;
      radio.checked = true;

      const name = document.querySelector(
        "input[name=name]"
      ) as HTMLInputElement;
      name.value = "louvre";

      ReactTestUtils.Simulate.change(name);
    });

    it("invokes onChange event on delete", (done) => {
      ReactTestUtils.act(() => {
        ReactDOM.render(
          <SearchForm
            value={FormSearch.fromJSON({
              default: "yahoo",
              engines: [
                ["louvre", "google.com"],
                ["yahoo", "yahoo.com"],
              ],
            })}
            onChange={(value) => {
              const json = value.toJSON();
              expect(json.default).toEqual("yahoo");
              expect(json.engines).toHaveLength(1);
              expect(json.engines).toEqual([["yahoo", "yahoo.com"]]);
              done();
            }}
          />,
          container
        );
      });

      const button = document.querySelector(
        "input[type=button]"
      ) as HTMLInputElement;
      ReactTestUtils.Simulate.click(button);
    });

    it("invokes onChange event on add", (done) => {
      ReactTestUtils.act(() => {
        ReactDOM.render(
          <SearchForm
            value={FormSearch.fromJSON({
              default: "yahoo",
              engines: [["google", "google.com"]],
            })}
            onChange={(value) => {
              const json = value.toJSON();
              expect(json.default).toEqual("yahoo");
              expect(json.engines).toHaveLength(2);
              expect(json.engines).toEqual([
                ["google", "google.com"],
                ["", ""],
              ]);
              done();
            }}
          />,
          container
        );
      });

      const button = document.querySelector(
        "input[type=button][name=add]"
      ) as HTMLInputElement;
      ReactTestUtils.Simulate.click(button);
    });
  });
});
