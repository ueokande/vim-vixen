import { expect } from "chai";
import DisableAddonOperator from "../../../../src/content/operators/impls/DisableAddonOperator";
import MockAddonIndicatorClient from "../../mock/MockAddonIndicatorClient";
import MockAddonEnabledRepository from "../../mock/MockAddonEnabledRepository";
import MockConsoleFramePresenter from "./MockConsoleFramePresenter";

describe("DisableAddonOperator", () => {
  describe("#run", () => {
    it("disables addon", async () => {
      const client = new MockAddonIndicatorClient(true);
      const repository = new MockAddonEnabledRepository(true);
      const presenter = new MockConsoleFramePresenter(true);
      const sut = new DisableAddonOperator(client, repository, presenter);

      await sut.run();

      expect(client.enabled).to.be.false;
      expect(repository.enabled).to.be.false;
      expect(presenter.attached).to.be.false;
    });
  });
});
