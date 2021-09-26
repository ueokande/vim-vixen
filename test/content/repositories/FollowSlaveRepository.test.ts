import FollowSlaveRepository, {
  FollowSlaveRepositoryImpl,
} from "../../../src/content/repositories/FollowSlaveRepository";

describe("FollowSlaveRepository", () => {
  let sut: FollowSlaveRepository;

  beforeEach(() => {
    sut = new FollowSlaveRepositoryImpl();
  });

  describe("#isFollowMode()/#enableFollowMode()/#disableFollowMode()", () => {
    it("gets, adds updates follow mode", () => {
      expect(sut.isFollowMode()).toBeFalsy;

      sut.enableFollowMode();
      expect(sut.isFollowMode()).toBeTruthy;

      sut.disableFollowMode();
      expect(sut.isFollowMode()).toBeFalsy;
    });
  });
});
