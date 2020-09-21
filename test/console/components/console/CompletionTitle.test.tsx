import React from "react";
import ReactTestRenderer from "react-test-renderer";
import { expect } from "chai";
import CompletionTitle from "../../../../src/console/components/console/CompletionTitle";

describe("console/components/console/completion/CompletionTitle", () => {
  it("renders a CompletionTitle", () => {
    const root = ReactTestRenderer.create(
      <CompletionTitle title="Fruits" shown={true} />
    ).root;

    const li = root.findByType("li");
    expect(li.children).to.deep.equal(["Fruits"]);
  });
});
