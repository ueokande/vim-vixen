import { injectable, inject } from "tsyringe";
import ContentMessageListener from "./infrastructures/ContentMessageListener";
import FindPortListener from "./infrastructures/FindPortListener";
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

  private readonly findPortListener = new FindPortListener(
    this.onFindPortConnect.bind(this),
    this.onFindPortDisconnect.bind(this)
  );

  run() {
    this.settingController.reload();

    browser.tabs.onUpdated.addListener((tabId: number, info) => {
      if (info.status == "loading") {
        this.findRepository.deleteLocalState(tabId);
      }
    });
    browser.runtime.onInstalled.addListener((details) => {
      if (details.reason !== "install" && details.reason !== "update") {
        return;
      }
      this.versionController.notify();
    });

    this.contentMessageListener.run();
    this.syncSettingRepository.onChange(() => {
      this.settingController.reload();
    });
    this.findPortListener.run();
  }

  private onFindPortConnect(port: browser.runtime.Port) {
    const tabId = port.sender?.tab?.id;
    const frameId = port.sender?.frameId;
    if (typeof tabId === "undefined" || typeof frameId === "undefined") {
      return;
    }

    this.frameRepository.addFrameId(tabId, frameId);
  }

  private onFindPortDisconnect(port: browser.runtime.Port) {
    const tabId = port.sender?.tab?.id;
    const frameId = port.sender?.frameId;
    if (typeof tabId === "undefined" || typeof frameId === "undefined") {
      return;
    }

    this.frameRepository.removeFrameId(tabId, frameId);
  }
}
