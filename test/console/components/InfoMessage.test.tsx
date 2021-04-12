import React from "react";
import ReactTestRenderer from "react-test-renderer";
import { expect } from "chai";
import InfoMessage from "../../../src/console/components/InfoMessage";

describe("console/components/console/completion/InfoMessage", () => {
  it("renders an information message", () => {
    const root = ReactTestRenderer.create(
      <InfoMessage mode="info">Hello!</InfoMessage>
    ).root;

    const p = root.findByType("p");

    expect(p.props["role"]).to.equal("status");
    expect(p.children).to.deep.equal(["Hello!"]);
  });
});
