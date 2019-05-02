import * as markActions from 'content/actions/mark';
import * as scrolls from 'content/scrolls';
import * as consoleFrames from 'content/console-frames';
import * as properties from 'shared/settings/properties';

const cancelKey = (key): boolean => {
  return key.key === 'Esc' || key.key === '[' && key.ctrlKey;
};

const globalKey = (key) => {
  return (/^[A-Z0-9]$/).test(key);
};

export default class MarkComponent {
  constructor(body, store) {
    this.body = body;
    this.store = store;
  }

  // eslint-disable-next-line max-statements
  key(key) {
    let { mark: markStage, setting } = this.store.getState();
    let smoothscroll = setting.properties.smoothscroll ||
      properties.defaults.smoothscroll;

    if (!markStage.setMode && !markStage.jumpMode) {
      return false;
    }

    if (cancelKey(key)) {
      this.store.dispatch(markActions.cancel());
      return true;
    }

    if (key.ctrlKey || key.metaKey || key.altKey) {
      consoleFrames.postError('Unknown mark');
    } else if (globalKey(key.key) && markStage.setMode) {
      this.doSetGlobal(key);
    } else if (globalKey(key.key) && markStage.jumpMode) {
      this.doJumpGlobal(key);
    } else if (markStage.setMode) {
      this.doSet(key);
    } else if (markStage.jumpMode) {
      this.doJump(markStage.marks, key, smoothscroll);
    }

    this.store.dispatch(markActions.cancel());
    return true;
  }

  doSet(key) {
    let { x, y } = scrolls.getScroll();
    this.store.dispatch(markActions.setLocal(key.key, x, y));
  }

  doJump(marks, key, smoothscroll) {
    if (!marks[key.key]) {
      consoleFrames.postError('Mark is not set');
      return;
    }

    let { x, y } = marks[key.key];
    scrolls.scrollTo(x, y, smoothscroll);
  }

  doSetGlobal(key) {
    let { x, y } = scrolls.getScroll();
    this.store.dispatch(markActions.setGlobal(key.key, x, y));
  }

  doJumpGlobal(key) {
    this.store.dispatch(markActions.jumpGlobal(key.key));
  }
}
