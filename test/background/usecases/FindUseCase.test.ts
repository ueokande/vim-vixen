import "reflect-metadata";
import sinon from "sinon";
import FindClient from "../../../src/background/clients/FindClient";
import StartFindUseCase from "../../../src/background/usecases/StartFindUseCase";
import FindRepository from "../../../src/background/repositories/FindRepository";
import { expect } from "chai";
import MockFindClient from "../mock/MockFindClient";
import MockFindRepository from "../mock/MockFindRepository";
import MockConsoleClient from "../mock/MockConsoleClient";
import ConsoleClient from "../../../src/background/infrastructures/ConsoleClient";

describe("FindUseCase", () => {
  let findClient: FindClient;
  let findRepository: FindRepository;
  let consoleClient: ConsoleClient;
  let sut: StartFindUseCase;

  const rangeData = (count: number): browser.find.RangeData[] => {
    const data = {
      text: "Hello, world",
      framePos: 0,
      startTextNodePos: 0,
      endTextNodePos: 0,
      startOffset: 0,
      endOffset: 0,
    };
    return Array(count).fill(data);
  };

  beforeEach(() => {
    findClient = new MockFindClient();
    findRepository = new MockFindRepository();
    consoleClient = new MockConsoleClient();
    sut = new StartFindUseCase(findClient, findRepository, consoleClient);
  });

  describe("startFind", function () {
    context("with a search keyword", () => {
      it("starts find and store last used keyword", async () => {
        const startFind = sinon
          .stub(findClient, "startFind")
          .returns(Promise.resolve({ count: 10, rangeData: rangeData(10) }));
        const highlightAll = sinon
          .mock(findClient)
          .expects("highlightAll")
          .once();
        const selectKeyword = sinon
          .mock(findClient)
          .expects("selectKeyword")
          .once();
        const showInfo = sinon
          .mock(consoleClient)
          .expects("showInfo")
          .once()
          .withArgs(10, "1 of 10 matched: Hello, world");

        await sut.startFind(10, "Hello, world");

        expect(startFind.calledWith("Hello, world")).to.be.true;
        expect(await findRepository.getGlobalKeyword()).to.equals(
          "Hello, world"
        );
        expect((await findRepository.getLocalState(10))?.keyword).to.equal(
          "Hello, world"
        );
        highlightAll.verify();
        selectKeyword.verify();
        showInfo.verify();
      });

      it("throws an error if no matched", (done) => {
        sinon
          .stub(findClient, "startFind")
          .returns(Promise.resolve({ count: 0, rangeData: [] }));

        sut.startFind(10, "Hello, world").catch((e) => {
          expect(e).instanceof(Error);
          done();
        });
      });
    });

    context("without a search keyword", () => {
      it("starts find with last used keyword in the tab", async () => {
        const startFind = sinon
          .stub(findClient, "startFind")
          .returns(Promise.resolve({ count: 10, rangeData: rangeData(10) }));
        await findRepository.setLocalState(10, {
          keyword: "Hello, world",
          rangeData: rangeData(10),
          highlightPosition: 0,
        });
        const highlightAll = sinon
          .mock(findClient)
          .expects("highlightAll")
          .once();
        const selectKeyword = sinon
          .mock(findClient)
          .expects("selectKeyword")
          .once();
        const showInfo = sinon
          .mock(consoleClient)
          .expects("showInfo")
          .once()
          .withArgs(10, "1 of 10 matched: Hello, world");

        await sut.startFind(10, undefined);

        expect(startFind.calledWith("Hello, world")).to.be.true;
        highlightAll.verify();
        selectKeyword.verify();
        showInfo.verify();
      });

      it("starts find with last used keyword in global", async () => {
        const startFind = sinon
          .stub(findClient, "startFind")
          .returns(Promise.resolve({ count: 10, rangeData: rangeData(10) }));
        await findRepository.setGlobalKeyword("Hello, world");
        const highlightAll = sinon
          .mock(findClient)
          .expects("highlightAll")
          .once();
        const selectKeyword = sinon
          .mock(findClient)
          .expects("selectKeyword")
          .once();
        const showInfo = sinon
          .mock(consoleClient)
          .expects("showInfo")
          .once()
          .withArgs(10, "1 of 10 matched: Hello, world");

        await sut.startFind(10, undefined);

        expect(startFind.calledWith("Hello, world")).to.be.true;
        highlightAll.verify();
        selectKeyword.verify();
        showInfo.verify();
      });
    });
  });
});
