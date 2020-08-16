import React from "react";
import ReactTestRenderer from "react-test-renderer";
import { expect } from "chai";
import CompletionItem from "../../../../src/console/components/console/CompletionItem";

describe("console/components/console/completion/CompletionItem", () => {
  it("renders a CompletionItem", () => {
    const root = ReactTestRenderer.create(
      <CompletionItem
        shown={true}
        highlight={false}
        caption="twitter"
        url="https://twitter.com/"
      />
    ).root;
    const spans = root.findAllByType("span");
    expect(spans).to.have.lengthOf(2);
    expect(spans[0].children).to.deep.equal(["twitter"]);
    expect(spans[1].children).to.deep.equal(["https://twitter.com/"]);
  });
});
