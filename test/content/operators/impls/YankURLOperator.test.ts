import { expect } from "chai";
import MockClipboardRepository from "../../mock/MockClipboardRepository";
import YankURLOperator from "../../../../src/content/operators/impls/YankURLOperator";
import MockURLRepository from "../../mock/MockURLRepository";
import MockConsoleClient from "../../mock/MockConsoleClient";

describe("YankOperation", () => {
  describe("#run", () => {
    it("copy current URL", async () => {
      const clipboardRepository = new MockClipboardRepository();
      const consoleClient = new MockConsoleClient();
      const urlRepository = new MockURLRepository("https://example.com/");
      const sut = new YankURLOperator(
        clipboardRepository,
        consoleClient,
        urlRepository
      );

      await sut.run();

      expect(clipboardRepository.read()).to.equal("https://example.com/");
      expect(consoleClient.text).to.equal("Yanked https://example.com/");
      expect(consoleClient.isError).to.be.false;
    });
  });
});
