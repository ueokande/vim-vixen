import React from "react";
import ReactTestRenderer from "react-test-renderer";
import ErrorMessage from "../../../src/console/components/ErrorMessage";

describe("console/components/console/completion/ErrorMessage", () => {
  it("renders an error message", () => {
    const root = ReactTestRenderer.create(
      <ErrorMessage>Hello!</ErrorMessage>
    ).root;

    const p = root.findByType("p");

    expect(p.props["role"]).toEqual("alert");
    expect(p.children).toEqual(["Hello!"]);
  });
});
