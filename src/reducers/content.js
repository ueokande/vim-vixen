import * as consoleFrames from '../console/frames';
import actions from '../actions';

export default function reducer(state, action = {}) {
  switch (action.type) {
  case actions.CMD_OPEN:
    return consoleFrames.showCommand('');
  case actions.CMD_TABS_OPEN:
    if (action.alter) {
      // alter url
      return consoleFrames.showCommand('open ' + window.location.href);
    } else {
      return consoleFrames.showCommand('open ');
    }
  case actions.CMD_BUFFER:
    return consoleFrames.showCommand('buffer ');
  }
}
