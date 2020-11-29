import { expect } from "chai";
import ToggleAddonOperator from "../../../../src/content/operators/impls/ToggleAddonOperator";
import MockAddonIndicatorClient from "../../mock/MockAddonIndicatorClient";
import MockAddonEnabledRepository from "../../mock/MockAddonEnabledRepository";

describe("ToggleAddonOperator", () => {
  describe("#run", () => {
    it("toggles addon-enabled state", async () => {
      const client = new MockAddonIndicatorClient(true);
      const repository = new MockAddonEnabledRepository(true);
      const sut = new ToggleAddonOperator(client, repository);

      await sut.run();

      expect(client.enabled).to.be.false;
      expect(repository.enabled).to.be.false;

      await sut.run();

      expect(client.enabled).to.be.true;
      expect(repository.enabled).to.be.true;
    });
  });
});
