import FollowSlaveRepository, { FollowSlaveRepositoryImpl }
  from '../repositories/FollowSlaveRepository';
import FollowPresenter, { FollowPresenterImpl }
  from '../presenters/FollowPresenter';
import TabsClient, { TabsClientImpl } from '../client/TabsClient';
import { LinkHint, InputHint } from '../presenters/Hint';
import FollowMasterClient, { FollowMasterClientImpl }
  from '../client/FollowMasterClient';
import Key from '../domains/Key';

interface Size {
  width: number;
  height: number;
}

interface Point {
  x: number;
  y: number;
}

export default class FollowSlaveUseCase {
  private presenter: FollowPresenter;

  private tabsClient: TabsClient;

  private followMasterClient: FollowMasterClient;

  private followSlaveRepository: FollowSlaveRepository;

  constructor({
    presenter = new FollowPresenterImpl(),
    tabsClient = new TabsClientImpl(),
    followMasterClient = new FollowMasterClientImpl(window.top),
    followSlaveRepository = new FollowSlaveRepositoryImpl(),
  } = {}) {
    this.presenter = presenter;
    this.tabsClient = tabsClient;
    this.followMasterClient = followMasterClient;
    this.followSlaveRepository = followSlaveRepository;
  }

  countTargets(viewSize: Size, framePosition: Point): void {
    let count = this.presenter.getTargetCount(viewSize, framePosition);
    this.followMasterClient.responseHintCount(count);
  }

  createHints(viewSize: Size, framePosition: Point, tags: string[]): void {
    this.followSlaveRepository.enableFollowMode();
    this.presenter.createHints(viewSize, framePosition, tags);
  }

  showHints(prefix: string) {
    this.presenter.filterHints(prefix);
  }

  sendKey(key: Key): void {
    this.followMasterClient.sendKey(key);
  }

  isFollowMode(): boolean {
    return this.followSlaveRepository.isFollowMode();
  }

  async activate(tag: string, newTab: boolean, background: boolean) {
    let hint = this.presenter.getHint(tag);
    if (!hint) {
      return;
    }

    if (hint instanceof LinkHint) {
      let url = hint.getLink();
      // ignore taget='_blank'
      if (!newTab && hint.getLinkTarget() === '_blank') {
        hint.click();
        return;
      }
      // eslint-disable-next-line no-script-url
      if (!url || url === '#' || url.toLowerCase().startsWith('javascript:')) {
        return;
      }
      await this.tabsClient.openUrl(url, newTab, background);
    } else if (hint instanceof InputHint) {
      hint.activate();
    }
  }

  clear(): void {
    this.followSlaveRepository.disableFollowMode();
    this.presenter.clearHints();
  }
}
