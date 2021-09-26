import KeymapRepository, {
  KeymapRepositoryImpl,
} from "../../../src/content/repositories/KeymapRepository";
import Key from "../../../src/shared/settings/Key";

describe("KeymapRepositoryImpl", () => {
  let sut: KeymapRepository;

  beforeEach(() => {
    sut = new KeymapRepositoryImpl();
  });

  describe("#enqueueKey()", () => {
    it("enqueues keys", () => {
      sut.enqueueKey(Key.fromMapKey("a"));
      sut.enqueueKey(Key.fromMapKey("b"));
      const sequence = sut.enqueueKey(Key.fromMapKey("c"));

      const keys = sequence.keys;
      expect(keys[0].equals(Key.fromMapKey("a"))).toBeTruthy;
      expect(keys[1].equals(Key.fromMapKey("b"))).toBeTruthy;
      expect(keys[2].equals(Key.fromMapKey("c"))).toBeTruthy;
    });
  });

  describe("#clear()", () => {
    it("clears keys", () => {
      sut.enqueueKey(Key.fromMapKey("a"));
      sut.enqueueKey(Key.fromMapKey("b"));
      sut.enqueueKey(Key.fromMapKey("c"));
      sut.clear();

      const sequence = sut.enqueueKey(Key.fromMapKey("a"));
      expect(sequence.length()).toEqual(1);
    });
  });
});
