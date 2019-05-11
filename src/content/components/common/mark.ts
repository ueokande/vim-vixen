import * as markActions from '../../actions/mark';
import * as consoleFrames from '../..//console-frames';
import * as keyUtils from '../../../shared/utils/keys';

import MarkUseCase from '../../usecases/MarkUseCase';

let markUseCase = new MarkUseCase();

const cancelKey = (key: keyUtils.Key): boolean => {
  return key.key === 'Esc' || key.key === '[' && Boolean(key.ctrlKey);
};

export default class MarkComponent {
  private store: any;

  constructor(store: any) {
    this.store = store;
  }

  // eslint-disable-next-line max-statements
  key(key: keyUtils.Key) {
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
    } else if (markState.setMode) {
      markUseCase.set(key.key);
    } else if (markState.jumpMode) {
      markUseCase.jump(key.key);
    }

    this.store.dispatch(markActions.cancel());
    return true;
  }
}
