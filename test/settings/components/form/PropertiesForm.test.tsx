import React from "react";
import ReactDOM from "react-dom";
import ReactTestRenderer from "react-test-renderer";
import ReactTestUtils from "react-dom/test-utils";
import PropertiesForm from "settings/components/form/PropertiesForm";

describe("settings/form/PropertiesForm", () => {
  describe("render", () => {
    it("renders PropertiesForm", () => {
      const types = {
        mystr: "string",
        mynum: "number",
        mybool: "boolean",
        empty: "string",
      };
      const values = {
        mystr: "abc",
        mynum: 123,
        mybool: true,
      };

      const root = ReactTestRenderer.create(
        <PropertiesForm types={types} value={values} />
      ).root;

      let input = root.findByProps({ name: "mystr" });
      expect(input.props.type).to.equals("text");
      expect(input.props.value).to.equal("abc");

      input = root.findByProps({ name: "mynum" });
      expect(input.props.type).to.equals("number");
      expect(input.props.value).to.equal(123);

      input = root.findByProps({ name: "mybool" });
      expect(input.props.type).to.equals("checkbox");
      expect(input.props.value).to.equal(true);
    });
  });

  describe("onChange", () => {
    let container;

    beforeEach(() => {
      container = document.createElement("div");
      document.body.appendChild(container);
    });

    afterEach(() => {
      document.body.removeChild(container);
      container = null;
    });

    it("invokes onChange event on text changed", (done) => {
      ReactTestUtils.act(() => {
        ReactDOM.render(
          <PropertiesForm
            types={{ myvalue: "string" }}
            value={{ myvalue: "abc" }}
            onChange={(value) => {
              expect(value).to.have.property("myvalue", "abcd");
              done();
            }}
          />,
          container
        );
      });

      const input = document.querySelector("input[name=myvalue]");
      input.value = "abcd";
      ReactTestUtils.Simulate.change(input);
    });

    it("invokes onChange event on number changeed", (done) => {
      ReactTestUtils.act(() => {
        ReactDOM.render(
          <PropertiesForm
            types={{ myvalue: "number" }}
            value={{ "": 123 }}
            onChange={(value) => {
              expect(value).to.have.property("myvalue", 1234);
              done();
            }}
          />,
          container
        );
      });

      const input = document.querySelector("input[name=myvalue]");
      input.value = "1234";
      ReactTestUtils.Simulate.change(input);
    });

    it("invokes onChange event on checkbox changed", (done) => {
      ReactTestUtils.act(() => {
        ReactDOM.render(
          <PropertiesForm
            types={{ myvalue: "boolean" }}
            value={{ myvalue: false }}
            onChange={(value) => {
              expect(value).to.have.property("myvalue", true);
              done();
            }}
          />,
          container
        );
      });

      const input = document.querySelector("input[name=myvalue]");
      input.checked = true;
      ReactTestUtils.Simulate.change(input);
    });
  });
});
