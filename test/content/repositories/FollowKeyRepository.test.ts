import FollowKeyRepository, {
  FollowKeyRepositoryImpl,
} from "../../../src/content/repositories/FollowKeyRepository";

describe("FollowKeyRepositoryImpl", () => {
  let sut: FollowKeyRepository;

  beforeEach(() => {
    sut = new FollowKeyRepositoryImpl();
  });

  describe("#getKeys()/#pushKey()/#popKey()", () => {
    it("enqueues keys", () => {
      expect(sut.getKeys()).toHaveLength(0);

      sut.pushKey("a");
      sut.pushKey("b");
      sut.pushKey("c");
      expect(sut.getKeys()).toEqual(["a", "b", "c"]);

      sut.popKey();
      expect(sut.getKeys()).toEqual(["a", "b"]);

      sut.clearKeys();
      expect(sut.getKeys()).toHaveLength(0);
    });
  });
});
