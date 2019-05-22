import * as messages from '../../shared/messages';

interface Size {
  width: number;
  height: number;
}

interface Point {
  x: number;
  y: number;
}

export default interface FollowSlaveClient {
  filterHints(prefix: string): void;

  requestHintCount(viewSize: Size, framePosition: Point): void;

  createHints(viewSize: Size, framePosition: Point, tags: string[]): void;

  clearHints(): void;

  activateIfExists(tag: string, newTab: boolean, background: boolean): void;
}

export class FollowSlaveClientImpl implements FollowSlaveClient {
  private target: Window;

  constructor(target: Window) {
    this.target = target;
  }

  filterHints(prefix: string): void {
    this.postMessage({
      type: messages.FOLLOW_SHOW_HINTS,
      prefix,
    });
  }

  requestHintCount(viewSize: Size, framePosition: Point): void {
    this.postMessage({
      type: messages.FOLLOW_REQUEST_COUNT_TARGETS,
      viewSize,
      framePosition,
    });
  }

  createHints(viewSize: Size, framePosition: Point, tags: string[]): void {
    this.postMessage({
      type: messages.FOLLOW_CREATE_HINTS,
      viewSize,
      framePosition,
      tags,
    });
  }

  clearHints(): void {
    this.postMessage({
      type: messages.FOLLOW_REMOVE_HINTS,
    });
  }

  activateIfExists(tag: string, newTab: boolean, background: boolean): void {
    this.postMessage({
      type: messages.FOLLOW_ACTIVATE,
      tag,
      newTab,
      background,
    });
  }

  private postMessage(msg: messages.Message): void {
    this.target.postMessage(JSON.stringify(msg), '*');
  }
}
