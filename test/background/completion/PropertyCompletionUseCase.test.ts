import "reflect-metadata";
import PropertyCompletionUseCase from "../../../src/background/completion/PropertyCompletionUseCase";

describe("PropertyCompletionUseCase", () => {
  describe("getProperties", () => {
    it("returns property types", async () => {
      const sut = new PropertyCompletionUseCase();

      const properties = await sut.getProperties();
      expect(properties).toContainEqual({
        name: "smoothscroll",
        type: "boolean",
      });
      expect(properties).toContainEqual({ name: "complete", type: "string" });
    });
  });
});
