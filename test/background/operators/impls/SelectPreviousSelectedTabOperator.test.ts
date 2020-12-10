import { expect } from "chai";
import sinon from "sinon";
import MockTabPresenter from "../../mock/MockTabPresenter";
import SelectPreviousSelectedTabOperator from "../../../../src/background/operators/impls/SelectPreviousSelectedTabOperator";

describe("SelectPreviousSelectedTabOperator", () => {
  describe("#run", () => {
    it("select the last-selected tab", async () => {
      const tabPresenter = new MockTabPresenter();
      await tabPresenter.create("https://example.com/1", { active: false });
      await tabPresenter.create("https://example.com/2", { active: true });
      await tabPresenter.create("https://example.com/3", { active: false });
      sinon.stub(tabPresenter, "getLastSelectedId").returns(Promise.resolve(0));

      const sut = new SelectPreviousSelectedTabOperator(tabPresenter);
      await sut.run();

      const url = (await tabPresenter.getCurrent()).url;
      expect(url).to.equal("https://example.com/1");
    });

    it("do nothing if no last-selected tabs", async () => {
      const tabPresenter = new MockTabPresenter();
      await tabPresenter.create("https://example.com/1", { active: false });
      await tabPresenter.create("https://example.com/2", { active: true });
      await tabPresenter.create("https://example.com/3", { active: false });
      sinon
        .stub(tabPresenter, "getLastSelectedId")
        .returns(Promise.resolve(undefined));
      const mock = sinon.mock(tabPresenter).expects("select").never();

      const sut = new SelectPreviousSelectedTabOperator(tabPresenter);
      await sut.run();

      mock.verify();
    });
  });
});
