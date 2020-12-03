import { expect } from "chai";
import OpenSourceOperator from "../../../../src/background/operators/impls/OpenSourceOperator";
import MockTabPresenter from "../../mock/MockTabPresenter";

describe("OpenSourceOperator", () => {
  describe("#run", () => {
    it("opens view-source URL of the current tab", async () => {
      const tabPresenter = new MockTabPresenter();
      await tabPresenter.create("https://example.com/");
      const sut = new OpenSourceOperator(tabPresenter);

      await sut.run();

      const urls = (await tabPresenter.getAll()).map((t) => t.url);
      expect(urls).to.be.deep.equal([
        "https://example.com/",
        "view-source:https://example.com/",
      ]);
    });
  });
});
