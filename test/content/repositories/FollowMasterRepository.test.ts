import FollowMasterRepository, {
  FollowMasterRepositoryImpl,
} from "../../../src/content/repositories/FollowMasterRepository";

describe("FollowMasterRepositoryImpl", () => {
  let sut: FollowMasterRepository;

  beforeEach(() => {
    sut = new FollowMasterRepositoryImpl();
  });

  describe("#getTags()/#addTag()/#clearTags()", () => {
    it("gets, adds and clears tags", () => {
      expect(sut.getTags()).toHaveLength(0);

      sut.addTag("a");
      sut.addTag("b");
      sut.addTag("c");
      expect(sut.getTags()).toEqual(["a", "b", "c"]);

      sut.clearTags();
      expect(sut.getTags()).toHaveLength(0);
    });
  });

  describe("#getTagsByPrefix", () => {
    it("gets tags matched by prefix", () => {
      for (const tag of ["a", "aa", "ab", "b", "ba", "bb"]) {
        sut.addTag(tag);
      }
      expect(sut.getTagsByPrefix("a")).toEqual(["a", "aa", "ab"]);
      expect(sut.getTagsByPrefix("aa")).toEqual(["aa"]);
      expect(sut.getTagsByPrefix("b")).toEqual(["b", "ba", "bb"]);
      expect(sut.getTagsByPrefix("c")).toHaveLength(0);
    });
  });

  describe("#setCurrentFollowMode()/#getCurrentNewTabMode()/#getCurrentBackgroundMode", () => {
    it("updates and gets follow mode", () => {
      sut.setCurrentFollowMode(false, true);
      expect(sut.getCurrentNewTabMode()).toBeFalsy;
      expect(sut.getCurrentBackgroundMode()).toBeTruthy;

      sut.setCurrentFollowMode(true, false);
      expect(sut.getCurrentNewTabMode()).toBeTruthy;
      expect(sut.getCurrentBackgroundMode()).toBeFalsy;
    });
  });
});
