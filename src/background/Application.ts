import { injectable, inject } from "tsyringe";
import ContentMessageListener from "./infrastructures/ContentMessageListener";
import SettingController from "./controllers/SettingController";
import VersionController from "./controllers/VersionController";
import SettingRepository from "./repositories/SettingRepository";
import FindRepositoryImpl from "./repositories/FindRepository";
import ReadyFrameRepository from "./repositories/ReadyFrameRepository";

@injectable()
export default class Application {
  constructor(
    private contentMessageListener: ContentMessageListener,
    private settingController: SettingController,
    private versionController: VersionController,
    @inject("SyncSettingRepository")
    private syncSettingRepository: SettingRepository,
    @inject("FindRepository")
    private readonly findRepository: FindRepositoryImpl,
    @inject("ReadyFrameRepository")
    private readonly frameRepository: ReadyFrameRepository
  ) {}

  run() {
    this.settingController.reload();

    browser.tabs.onUpdated.addListener((tabId: number, info) => {
      if (info.status == "loading") {
        this.frameRepository.clearFrameIds(tabId);
        this.findRepository.deleteLocalState(tabId);
      }
    });
    browser.runtime.onInstalled.addListener((details) => {
      if (details.reason !== "install" && details.reason !== "update") {
        return;
      }
      this.versionController.notify();
    });
    browser.webNavigation.onCompleted.addListener((detail) => {
      // The console iframe embedded by Vim-Vixen has url starting with
      // 'moz-extensions://'.  The add-on should ignore it from search targets.
      //
      // When a browser blocks to load an iframe by x-frame options or a
      // content security policy, the URL begins with 'about:neterror', and
      // a background script fails to send a message to iframe.
      if (
        detail.url.startsWith("http://") ||
        detail.url.startsWith("https://")
      ) {
        this.frameRepository.addFrameId(detail.tabId, detail.frameId);
      }
    });

    this.contentMessageListener.run();
    this.syncSettingRepository.onChange(() => {
      this.settingController.reload();
    });
  }
}
