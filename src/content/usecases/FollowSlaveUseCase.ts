import { injectable, inject } from 'tsyringe';
import FollowSlaveRepository from '../repositories/FollowSlaveRepository';
import FollowPresenter from '../presenters/FollowPresenter';
import TabsClient from '../client/TabsClient';
import FollowMasterClient from '../client/FollowMasterClient';
import { LinkHint, InputHint } from '../presenters/Hint';
import Key from '../../shared/settings/Key';

interface Size {
  width: number;
  height: number;
}

interface Point {
  x: number;
  y: number;
}

@injectable()
export default class FollowSlaveUseCase {
  constructor(
    @inject('FollowPresenter')
    private presenter: FollowPresenter,

    @inject('TabsClient')
    private tabsClient: TabsClient,

    @inject('FollowMasterClient')
    private followMasterClient: FollowMasterClient,

    @inject('FollowSlaveRepository')
    private followSlaveRepository: FollowSlaveRepository,
  ) {
  }

  countTargets(viewSize: Size, framePosition: Point): void {
    const count = this.presenter.getTargetCount(viewSize, framePosition);
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
    const hint = this.presenter.getHint(tag);
    if (!hint) {
      return;
    }

    if (hint instanceof LinkHint) {
      const url = hint.getLink();
      let openNewTab = newTab;
      // Open link by background script in order to prevent a popup block
      if (hint.getLinkTarget() === '_blank') {
        openNewTab = true;
      }
      // eslint-disable-next-line no-script-url
      if (!url || url === '#' || url.toLowerCase().startsWith('javascript:')) {
        return;
      }
      await this.tabsClient.openUrl(url, openNewTab, background);
    } else if (hint instanceof InputHint) {
      hint.activate();
    }
  }

  clear(): void {
    this.followSlaveRepository.disableFollowMode();
    this.presenter.clearHints();
  }
}
