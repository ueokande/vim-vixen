import React from "react";
import ReactTestRenderer from "react-test-renderer";
import InfoMessage from "../../../src/console/components/InfoMessage";

describe("console/components/console/completion/InfoMessage", () => {
  it("renders an information message", () => {
    const root = ReactTestRenderer.create(
      <InfoMessage>Hello!</InfoMessage>
    ).root;

    const p = root.findByType("p");

    expect(p.props["role"]).toEqual("status");
    expect(p.children).toEqual(["Hello!"]);
  });
});
