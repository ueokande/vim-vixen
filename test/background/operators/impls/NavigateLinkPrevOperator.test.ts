import NavigateLinkPrevOperator from "../../../../src/background/operators/impls/NavigateLinkPrevOperator";
import MockTabPresenter from "../../mock/MockTabPresenter";
import MockNavigateClient from "../../mock/MockNavigateClient";

describe("NavigateLinkPrevOperator", () => {
  describe("#run", () => {
    it("send a message to navigate next page", async () => {
      const navigateClient = new MockNavigateClient();
      const linkPrevSpy = jest
        .spyOn(navigateClient, "linkPrev")
        .mockReturnValueOnce(Promise.resolve());
      const tabPresenter = new MockTabPresenter();
      await tabPresenter.create("https://example.com/1", { active: false });
      await tabPresenter.create("https://example.com/2", { active: true });
      await tabPresenter.create("https://example.com/3", { active: false });
      const sut = new NavigateLinkPrevOperator(tabPresenter, navigateClient);

      await sut.run();

      expect(linkPrevSpy).toBeCalledWith(1);
    });
  });
});
