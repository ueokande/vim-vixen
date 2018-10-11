import * as markActions from 'content/actions/mark';
import * as scrolls from 'content/scrolls';
import * as consoleFrames from 'content/console-frames';
import * as properties from 'shared/settings/properties';

const cancelKey = (key) => {
  return key.key === 'Esc' || key.key === '[' && key.ctrlKey;
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
      consoleFrames.postError(window.document, 'Unknown mark');
    } else if (key.shiftKey) {
      consoleFrames.postError(window.document, 'Globa marks not supported');
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
      consoleFrames.postError(window.document, 'Mark is not set');
      return;
    }

    let { x, y } = marks[key.key];
    scrolls.scrollTo(x, y, smoothscroll);
  }
}
