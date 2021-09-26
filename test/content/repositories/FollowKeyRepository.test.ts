import FollowKeyRepository, {
  FollowKeyRepositoryImpl,
} from "../../../src/content/repositories/FollowKeyRepository";
import { expect } from "chai";

describe("FollowKeyRepositoryImpl", () => {
  let sut: FollowKeyRepository;

  beforeEach(() => {
    sut = new FollowKeyRepositoryImpl();
  });

  describe("#getKeys()/#pushKey()/#popKey()", () => {
    it("enqueues keys", () => {
      expect(sut.getKeys()).to.be.empty;

      sut.pushKey("a");
      sut.pushKey("b");
      sut.pushKey("c");
      expect(sut.getKeys()).to.deep.equal(["a", "b", "c"]);

      sut.popKey();
      expect(sut.getKeys()).to.deep.equal(["a", "b"]);

      sut.clearKeys();
      expect(sut.getKeys()).to.be.empty;
    });
  });
});
