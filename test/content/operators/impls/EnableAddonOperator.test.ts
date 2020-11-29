import { expect } from "chai";
import EnableAddonOperator from "../../../../src/content/operators/impls/EnableAddonOperator";
import MockAddonIndicatorClient from "../../mock/MockAddonIndicatorClient";
import MockAddonEnabledRepository from "../../mock/MockAddonEnabledRepository";

describe("EnableAddonOperator", () => {
  describe("#run", () => {
    it("enabled addon", async () => {
      const client = new MockAddonIndicatorClient(false);
      const repository = new MockAddonEnabledRepository(false);
      const sut = new EnableAddonOperator(client, repository);

      await sut.run();

      expect(client.enabled).to.be.true;
      expect(repository.enabled).to.be.true;
    });
  });
});
