import EnableAddonOperator from "../../../../src/content/operators/impls/EnableAddonOperator";
import MockAddonIndicatorClient from "../../mock/MockAddonIndicatorClient";
import MockAddonEnabledRepository from "../../mock/MockAddonEnabledRepository";
import MockConsoleFramePresenter from "./MockConsoleFramePresenter";

describe("EnableAddonOperator", () => {
  describe("#run", () => {
    it("enabled addon", async () => {
      const client = new MockAddonIndicatorClient(false);
      const repository = new MockAddonEnabledRepository(false);
      const presenter = new MockConsoleFramePresenter(false);
      const sut = new EnableAddonOperator(client, repository, presenter);

      await sut.run();

      expect(client.enabled).toBeTruthy;
      expect(repository.enabled).toBeTruthy;
      expect(presenter.attached).toBeTruthy;
    });
  });
});
