import * as consoleFrames from '../console/frames';
import * as histories from '../content/histories';
import * as scrolls from '../content/scrolls';
import Follow from '../content/follow';
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
  case actions.SCROLL_LINES:
    scrolls.scrollLines(window, action.count);
    break;
  case actions.SCROLL_PAGES:
    scrolls.scrollPages(window, action.count);
    break;
  case actions.SCROLL_TOP:
    scrolls.scrollTop(window);
    break;
  case actions.SCROLL_BOTTOM:
    scrolls.scrollBottom(window);
    break;
  case actions.SCROLL_LEFT:
    scrolls.scrollLeft(window);
    break;
  case actions.SCROLL_RIGHT:
    scrolls.scrollRight(window);
    break;
  case actions.FOLLOW_START:
    new Follow(window.document, action.newTab);
    break;
  case actions.HISTORY_PREV:
    histories.prev(window);
    break;
  case actions.HISTORY_NEXT:
    histories.next(window);
    break;
  }
}
