import ToggleAddonOperator from "../../../../src/content/operators/impls/ToggleAddonOperator";
import MockAddonIndicatorClient from "../../mock/MockAddonIndicatorClient";
import MockAddonEnabledRepository from "../../mock/MockAddonEnabledRepository";
import MockConsoleFramePresenter from "./MockConsoleFramePresenter";

describe("ToggleAddonOperator", () => {
  describe("#run", () => {
    it("toggles addon-enabled state", async () => {
      const client = new MockAddonIndicatorClient(true);
      const repository = new MockAddonEnabledRepository(true);
      const presenter = new MockConsoleFramePresenter(true);
      const sut = new ToggleAddonOperator(client, repository, presenter);

      await sut.run();

      expect(client.enabled).toBeFalsy;
      expect(repository.enabled).toBeFalsy;
      expect(presenter.attached).toBeFalsy;

      await sut.run();

      expect(client.enabled).toBeTruthy;
      expect(repository.enabled).toBeTruthy;
      expect(presenter.attached).toBeTruthy;
    });
  });
});
