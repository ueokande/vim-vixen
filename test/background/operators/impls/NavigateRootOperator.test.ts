import { expect } from "chai";
import NavigateRootOperator from "../../../../src/background/operators/impls/NavigateRootOperator";
import MockTabPresenter from "../../mock/MockTabPresenter";

describe("NavigateRootOperator", () => {
  describe("#run", () => {
    it("opens root directory in the URL", async () => {
      const tabPresenter = new MockTabPresenter();
      await tabPresenter.create("https://example.com/search?q=apple#top");
      const sut = new NavigateRootOperator(tabPresenter);

      await sut.run();

      const url = (await tabPresenter.getCurrent()).url;
      expect(url).to.be.equal("https://example.com");
    });
  });
});
