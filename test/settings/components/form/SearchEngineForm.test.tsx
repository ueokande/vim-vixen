/**
 * @jest-environment jsdom
 */

import React from "react";
import ReactDOM from "react-dom";
import ReactTestRenderer from "react-test-renderer";
import ReactTestUtils from "react-dom/test-utils";
import SearchForm from "../../../../src/settings/components/form/SearchForm";
import { FormSearch } from "../../../../src/shared/SettingData";
import { expect } from "chai";

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
      expect(names).to.have.lengthOf(2);
      expect(names[0].props.value).to.equal("google");
      expect(names[1].props.value).to.equal("yahoo");

      const urls = root
        .findAllByType("input")
        .filter((instance) => instance.props.name === "url");
      expect(urls).to.have.lengthOf(2);
      expect(urls[0].props.value).to.equal("google.com");
      expect(urls[1].props.value).to.equal("yahoo.com");
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
              expect(json.default).to.equal("louvre");
              expect(json.engines).to.have.lengthOf(2);
              expect(json.engines).to.have.deep.members([
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
              expect(json.default).to.equal("yahoo");
              expect(json.engines).to.have.lengthOf(1);
              expect(json.engines).to.have.deep.members([
                ["yahoo", "yahoo.com"],
              ]);
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
              expect(json.default).to.equal("yahoo");
              expect(json.engines).to.have.lengthOf(2);
              expect(json.engines).to.have.deep.members([
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
