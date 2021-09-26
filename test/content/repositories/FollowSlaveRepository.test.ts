import FollowSlaveRepository, {
  FollowSlaveRepositoryImpl,
} from "../../../src/content/repositories/FollowSlaveRepository";
import { expect } from "chai";

describe("FollowSlaveRepository", () => {
  let sut: FollowSlaveRepository;

  beforeEach(() => {
    sut = new FollowSlaveRepositoryImpl();
  });

  describe("#isFollowMode()/#enableFollowMode()/#disableFollowMode()", () => {
    it("gets, adds updates follow mode", () => {
      expect(sut.isFollowMode()).to.be.false;

      sut.enableFollowMode();
      expect(sut.isFollowMode()).to.be.true;

      sut.disableFollowMode();
      expect(sut.isFollowMode()).to.be.false;
    });
  });
});
