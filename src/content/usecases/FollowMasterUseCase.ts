import { injectable, inject } from "tsyringe";
import FollowKeyRepository from "../repositories/FollowKeyRepository";
import FollowMasterRepository from "../repositories/FollowMasterRepository";
import FollowSlaveClient from "../client/FollowSlaveClient";
import FollowSlaveClientFactory from "../client/FollowSlaveClientFactory";
import SettingRepository from "../repositories/SettingRepository";
import HintKeyRepository from "../repositories/HintKeyRepository";

@injectable()
export default class FollowMasterUseCase {
  constructor(
    @inject("FollowKeyRepository")
    private followKeyRepository: FollowKeyRepository,

    @inject("FollowMasterRepository")
    private followMasterRepository: FollowMasterRepository,

    @inject("SettingRepository")
    private settingRepository: SettingRepository,

    @inject("FollowSlaveClientFactory")
    private followSlaveClientFactory: FollowSlaveClientFactory,

    @inject("HintKeyRepository")
    private hintKeyRepository: HintKeyRepository
  ) {}

  startFollow(newTab: boolean, background: boolean): void {
    const hintchars = this.settingRepository.get().properties.hintchars;
    this.hintKeyRepository.reset(hintchars);

    this.followKeyRepository.clearKeys();
    this.followMasterRepository.setCurrentFollowMode(newTab, background);

    const viewWidth = window.top.innerWidth;
    const viewHeight = window.top.innerHeight;
    this.followSlaveClientFactory
      .create(window.top)
      .requestHintCount(
        { width: viewWidth, height: viewHeight },
        { x: 0, y: 0 }
      );

    const frameElements = window.document.querySelectorAll("iframe");
    for (let i = 0; i < frameElements.length; ++i) {
      const ele = frameElements[i] as HTMLFrameElement | HTMLIFrameElement;
      const { left: frameX, top: frameY } = ele.getBoundingClientRect();
      const client = this.followSlaveClientFactory.create(ele.contentWindow!);
      client.requestHintCount(
        { width: viewWidth, height: viewHeight },
        { x: frameX, y: frameY }
      );
    }
  }

  // eslint-disable-next-line max-statements
  createSlaveHints(count: number, sender: Window): void {
    const produced = [];
    for (let i = 0; i < count; ++i) {
      const tag = this.hintKeyRepository.produce();
      produced.push(tag);
      this.followMasterRepository.addTag(tag);
    }

    const doc = window.document;
    const viewWidth = window.innerWidth || doc.documentElement.clientWidth;
    const viewHeight = window.innerHeight || doc.documentElement.clientHeight;
    let pos = { x: 0, y: 0 };
    if (sender !== window) {
      const frameElements = window.document.querySelectorAll("iframe");
      const ele = Array.from(frameElements).find(
        (e) => e.contentWindow === sender
      );
      if (!ele) {
        // elements of the sender is gone
        return;
      }
      const { left: frameX, top: frameY } = ele.getBoundingClientRect();
      pos = { x: frameX, y: frameY };
    }
    const client = this.followSlaveClientFactory.create(sender);
    client.createHints({ width: viewWidth, height: viewHeight }, pos, produced);
  }

  cancelFollow(): void {
    this.followMasterRepository.clearTags();
    this.broadcastToSlaves((client) => {
      client.clearHints();
    });
  }

  filter(prefix: string): void {
    this.broadcastToSlaves((client) => {
      client.filterHints(prefix);
    });
  }

  activate(tag: string): void {
    this.followMasterRepository.clearTags();

    const newTab = this.followMasterRepository.getCurrentNewTabMode();
    const background = this.followMasterRepository.getCurrentBackgroundMode();
    this.broadcastToSlaves((client) => {
      client.activateIfExists(tag, newTab, background);
      client.clearHints();
    });
  }

  enqueue(key: string): void {
    switch (key) {
      case "Enter":
        this.activate(this.getCurrentTag());
        return;
      case "Esc":
        this.cancelFollow();
        return;
      case "Backspace":
      case "Delete":
        this.followKeyRepository.popKey();
        this.filter(this.getCurrentTag());
        return;
    }

    this.followKeyRepository.pushKey(key);

    const tag = this.getCurrentTag();
    const matched = this.followMasterRepository.getTagsByPrefix(tag);
    if (matched.length === 0) {
      this.cancelFollow();
    } else if (matched.length === 1) {
      this.activate(tag);
    } else {
      this.filter(tag);
    }
  }

  private broadcastToSlaves(handler: (client: FollowSlaveClient) => void) {
    const allFrames = [window.self].concat(Array.from(window.frames as any));
    const clients = allFrames.map((w) =>
      this.followSlaveClientFactory.create(w)
    );
    for (const client of clients) {
      handler(client);
    }
  }

  private getCurrentTag(): string {
    return this.followKeyRepository.getKeys().join("");
  }
}
