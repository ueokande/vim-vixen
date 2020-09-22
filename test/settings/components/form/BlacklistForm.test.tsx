import React from "react";
import ReactDOM from "react-dom";
import ReactTestRenderer from "react-test-renderer";
import ReactTestUtils from "react-dom/test-utils";
import { expect } from "chai";

import BlacklistForm from "../../../../src/settings/components/form/BlacklistForm";
import Blacklist from "../../../../src/shared/settings/Blacklist";
import AddButton from "../../../../src/settings/components/ui/AddButton";

describe("settings/form/BlacklistForm", () => {
  describe("render", () => {
    it("renders BlacklistForm", () => {
      const root = ReactTestRenderer.create(
        <BlacklistForm
          value={Blacklist.fromJSON(["*.slack.com", "www.google.com/maps"])}
        />
      ).root;

      const rows = root
        .findAllByType("div")
        .filter((instance) => instance.props.role === "listitem");
      expect(rows).to.have.lengthOf(2);
      expect(rows[0].findByProps({ name: "url" }).props.value).to.equal(
        "*.slack.com"
      );
      expect(rows[1].findByProps({ name: "url" }).props.value).to.equal(
        "www.google.com/maps"
      );

      expect(() => root.findByType(AddButton)).not.throw();
    });

    it("renders blank value", () => {
      const root = ReactTestRenderer.create(<BlacklistForm />).root;

      const rows = root.findAllByProps({
        className: "form-blacklist-form-row",
      });
      expect(rows).to.be.empty;
    });
  });

  describe("onChange", () => {
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
          <BlacklistForm
            value={Blacklist.fromJSON(["*.slack.com", "www.google.com/maps*"])}
            onChange={(value) => {
              const urls = value.items.map((item) => item.pattern);
              expect(urls).to.have.members([
                "gitter.im",
                "www.google.com/maps*",
              ]);
              done();
            }}
          />,
          container
        );
      });

      const input = document.querySelectorAll(
        "input[type=text]"
      )[0] as HTMLInputElement;
      input.value = "gitter.im";
      ReactTestUtils.Simulate.change(input);
    });

    it("invokes onChange event on delete", (done) => {
      ReactTestUtils.act(() => {
        ReactDOM.render(
          <BlacklistForm
            value={Blacklist.fromJSON(["*.slack.com", "www.google.com/maps*"])}
            onChange={(value) => {
              const urls = value.items.map((item) => item.pattern);
              expect(urls).to.have.members(["www.google.com/maps*"]);
              done();
            }}
          />,
          container
        );
      });

      const button = document.querySelectorAll("input[type=button]")[0];
      ReactTestUtils.Simulate.click(button);
    });

    it("invokes onChange event on add", (done) => {
      ReactTestUtils.act(() => {
        ReactDOM.render(
          <BlacklistForm
            value={Blacklist.fromJSON(["*.slack.com"])}
            onChange={(value) => {
              const urls = value.items.map((item) => item.pattern);
              expect(urls).to.have.members(["*.slack.com", ""]);
              done();
            }}
          />,
          container
        );
      });

      const button = document.querySelector(
        "input[type=button][name=add]"
      ) as HTMLButtonElement;
      ReactTestUtils.Simulate.click(button);
    });
  });
});
