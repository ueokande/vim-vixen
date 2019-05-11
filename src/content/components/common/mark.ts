import * as markActions from '../../actions/mark';
import * as consoleFrames from '../..//console-frames';
import * as keyUtils from '../../../shared/utils/keys';
import Mark from '../../Mark';

import { SettingRepositoryImpl } from '../../repositories/SettingRepository';
import { ScrollPresenterImpl } from '../../presenters/ScrollPresenter';

let settingRepository = new SettingRepositoryImpl();
let scrollPresenter = new ScrollPresenterImpl();

const cancelKey = (key: keyUtils.Key): boolean => {
  return key.key === 'Esc' || key.key === '[' && Boolean(key.ctrlKey);
};

const globalKey = (key: string): boolean => {
  return (/^[A-Z0-9]$/).test(key);
};

export default class MarkComponent {
  private store: any;

  constructor(store: any) {
    this.store = store;
  }

  // eslint-disable-next-line max-statements
  key(key: keyUtils.Key) {
    let smoothscroll = settingRepository.get().properties.smoothscroll;
    let { mark: markState } = this.store.getState();

    if (!markState.setMode && !markState.jumpMode) {
      return false;
    }

    if (cancelKey(key)) {
      this.store.dispatch(markActions.cancel());
      return true;
    }

    if (key.ctrlKey || key.metaKey || key.altKey) {
      consoleFrames.postError('Unknown mark');
    } else if (globalKey(key.key) && markState.setMode) {
      this.doSetGlobal(key);
    } else if (globalKey(key.key) && markState.jumpMode) {
      this.doJumpGlobal(key);
    } else if (markState.setMode) {
      this.doSet(key);
    } else if (markState.jumpMode) {
      this.doJump(markState.marks, key, smoothscroll);
    }

    this.store.dispatch(markActions.cancel());
    return true;
  }

  doSet(key: keyUtils.Key) {
    let { x, y } = scrollPresenter.getScroll();
    this.store.dispatch(markActions.setLocal(key.key, x, y));
  }

  doJump(
    marks: { [key: string]: Mark },
    key: keyUtils.Key,
    smoothscroll: boolean,
  ) {
    if (!marks[key.key]) {
      consoleFrames.postError('Mark is not set');
      return;
    }

    let { x, y } = marks[key.key];
    scrollPresenter.scrollTo(x, y, smoothscroll);
  }

  doSetGlobal(key: keyUtils.Key) {
    let { x, y } = scrollPresenter.getScroll();
    this.store.dispatch(markActions.setGlobal(key.key, x, y));
  }

  doJumpGlobal(key: keyUtils.Key) {
    this.store.dispatch(markActions.jumpGlobal(key.key));
  }
}
