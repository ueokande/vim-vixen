import { expect } from "chai";
import DisableAddonOperator from "../../../../src/content/operators/impls/DisableAddonOperator";
import MockAddonIndicatorClient from "../../mock/MockAddonIndicatorClient";
import MockAddonEnabledRepository from "../../mock/MockAddonEnabledRepository";

describe("DisableAddonOperator", () => {
  describe("#run", () => {
    it("disables addon", async () => {
      const client = new MockAddonIndicatorClient(true);
      const repository = new MockAddonEnabledRepository(true);
      const sut = new DisableAddonOperator(client, repository);

      await sut.run();

      expect(client.enabled).to.be.false;
      expect(repository.enabled).to.be.false;
    });
  });
});
