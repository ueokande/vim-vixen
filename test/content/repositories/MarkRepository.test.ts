import { MarkRepositoryImpl } from "../../../src/content/repositories/MarkRepository";

describe("MarkRepositoryImpl", () => {
  it("save and load marks", () => {
    const sut = new MarkRepositoryImpl();

    sut.set("a", { x: 10, y: 20 });
    expect(sut.get("a")).toEqual({ x: 10, y: 20 });
    expect(sut.get("b")).toBeNull;
  });
});
