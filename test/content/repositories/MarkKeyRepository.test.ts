import MarkRepository, {
  MarkKeyRepositoryImpl,
} from "../../../src/content/repositories/MarkKeyRepository";
import { expect } from "chai";

describe("MarkKeyRepositoryImpl", () => {
  let sut: MarkRepository;

  before(() => {
    sut = new MarkKeyRepositoryImpl();
  });

  describe("#isSetMode/#enableSetMode/#disabeSetMode", () => {
    it("enables and disables set mode", () => {
      expect(sut.isSetMode()).to.be.false;

      sut.enableSetMode();
      expect(sut.isSetMode()).to.be.true;

      sut.disabeSetMode();
      expect(sut.isSetMode()).to.be.false;
    });
  });

  describe("#isJumpMode/#enableJumpMode/#disabeJumpMode", () => {
    it("enables and disables jump mode", () => {
      expect(sut.isJumpMode()).to.be.false;

      sut.enableJumpMode();
      expect(sut.isJumpMode()).to.be.true;

      sut.disabeJumpMode();
      expect(sut.isJumpMode()).to.be.false;
    });
  });
});
