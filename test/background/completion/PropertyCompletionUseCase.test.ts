import "reflect-metadata";
import PropertyCompletionUseCase from "../../../src/background/completion/PropertyCompletionUseCase";
import { expect } from "chai";

describe("PropertyCompletionUseCase", () => {
  describe("getProperties", () => {
    it("returns property types", async () => {
      const sut = new PropertyCompletionUseCase();

      const properties = await sut.getProperties();
      expect(properties).to.deep.contain({
        name: "smoothscroll",
        type: "boolean",
      });
      expect(properties).to.deep.contain({ name: "complete", type: "string" });
    });
  });
});
