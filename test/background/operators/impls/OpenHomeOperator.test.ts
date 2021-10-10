import OpenHomeOperator from "../../../../src/background/operators/impls/OpenHomeOperator";
import MockTabPresenter from "../../mock/MockTabPresenter";
import MockBrowserSettingRepository from "../../mock/MockBrowserSettingRepository";

describe("OpenHomeOperator", () => {
  describe("#run", () => {
    it("opens a home page of the browser into the current tab", async () => {
      const tabPresenter = new MockTabPresenter();
      await tabPresenter.create("https://example.com/");
      const browserSettingRepository = new MockBrowserSettingRepository([
        "https://example.net/",
      ]);
      const sut = new OpenHomeOperator(
        tabPresenter,
        browserSettingRepository,
        false
      );

      await sut.run();

      const url = (await tabPresenter.getCurrent()).url;
      expect(url).toEqual("https://example.net/");
    });

    it("opens a home page of the browser into a new tab", async () => {
      const tabPresenter = new MockTabPresenter();
      await tabPresenter.create("https://example.com/");
      const browserSettingRepository = new MockBrowserSettingRepository([
        "https://example.net/",
      ]);
      const sut = new OpenHomeOperator(
        tabPresenter,
        browserSettingRepository,
        true
      );

      await sut.run();

      const urls = (await tabPresenter.getAll()).map((t) => t.url);
      expect(urls).toEqual(["https://example.com/", "https://example.net/"]);
    });

    it("opens home pages of the browser", async () => {
      const tabPresenter = new MockTabPresenter();
      await tabPresenter.create("https://example.com/");
      const browserSettingRepository = new MockBrowserSettingRepository([
        "https://example.net/",
        "https://example.org/",
      ]);
      const sut = new OpenHomeOperator(
        tabPresenter,
        browserSettingRepository,
        false
      );

      await sut.run();

      const urls = (await tabPresenter.getAll()).map((t) => t.url);
      expect(urls).toEqual([
        "https://example.com/",
        "https://example.net/",
        "https://example.org/",
      ]);
    });
  });
});
