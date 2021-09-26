import MarkRepository, {
  MarkKeyRepositoryImpl,
} from "../../../src/content/repositories/MarkKeyRepository";

describe("MarkKeyRepositoryImpl", () => {
  let sut: MarkRepository;

  beforeEach(() => {
    sut = new MarkKeyRepositoryImpl();
  });

  describe("#isSetMode/#enableSetMode/#disabeSetMode", () => {
    it("enables and disables set mode", () => {
      expect(sut.isSetMode()).toBeFalsy;

      sut.enableSetMode();
      expect(sut.isSetMode()).toBeTruthy;

      sut.disabeSetMode();
      expect(sut.isSetMode()).toBeFalsy;
    });
  });

  describe("#isJumpMode/#enableJumpMode/#disabeJumpMode", () => {
    it("enables and disables jump mode", () => {
      expect(sut.isJumpMode()).toBeFalsy;

      sut.enableJumpMode();
      expect(sut.isJumpMode()).toBeTruthy;

      sut.disabeJumpMode();
      expect(sut.isJumpMode()).toBeFalsy;
    });
  });
});
