import React from "react";
import ReactTestRenderer from "react-test-renderer";
import { expect } from "chai";
import Message from "../../../../src/console/components/console/Message";

describe("console/components/console/completion/Message", () => {
  it("renders an information message", () => {
    const root = ReactTestRenderer.create(<Message mode="info">Hello!</Message>)
      .root;

    const p = root.findByType("p");

    expect(p.props["role"]).to.equal("status");
    expect(p.children).to.deep.equal(["Hello!"]);
  });

  it("renders an error message", () => {
    const root = ReactTestRenderer.create(
      <Message mode="error">Hello!</Message>
    ).root;

    const p = root.findByType("p");

    expect(p.props["role"]).to.equal("alert");
    expect(p.children).to.deep.equal(["Hello!"]);
  });
});
