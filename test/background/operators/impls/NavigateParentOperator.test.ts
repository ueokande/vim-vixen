import { expect } from "chai";
import MockTabPresenter from "../../mock/MockTabPresenter";
import NavigateParentOperator from "../../../../src/background/operators/impls/NavigateParentOperator";

describe("NavigateParentOperator", () => {
  describe("#run", () => {
    it("opens a parent directory of the file in the URL", async () => {
      const tabPresenter = new MockTabPresenter();
      await tabPresenter.create("https://example.com/fruits/yellow/banana", {
        active: true,
      });
      const sut = new NavigateParentOperator(tabPresenter);

      await sut.run();

      const url = (await tabPresenter.getCurrent()).url;
      expect(url).to.be.equal("https://example.com/fruits/yellow/");
    });

    it("opens a parent directory of the directoryin the URL", async () => {
      const tabPresenter = new MockTabPresenter();
      await tabPresenter.create("https://example.com/fruits/yellow/");
      const sut = new NavigateParentOperator(tabPresenter);

      await sut.run();

      const url = (await tabPresenter.getCurrent()).url;
      expect(url).to.be.equal("https://example.com/fruits/");
    });

    it("removes a hash in the URL", async () => {
      const tabPresenter = new MockTabPresenter();
      await tabPresenter.create("https://example.com/fruits/yellow/#top");
      const sut = new NavigateParentOperator(tabPresenter);

      await sut.run();

      const url = (await tabPresenter.getCurrent()).url;
      expect(url).to.be.equal("https://example.com/fruits/yellow/");
    });

    it("removes query parameters in the URL", async () => {
      const tabPresenter = new MockTabPresenter();
      await tabPresenter.create("https://example.com/search?q=apple");
      const sut = new NavigateParentOperator(tabPresenter);

      await sut.run();

      const url = (await tabPresenter.getCurrent()).url;
      expect(url).to.be.equal("https://example.com/search");
    });
  });
});
