import './console-frame.scss';
import * as consoleFrames from './console-frames';
import * as scrolls from '../content/scrolls';
import * as navigates from '../content/navigates';
import * as followActions from '../actions/follow';
import * as store from '../store';
import ContentInputComponent from '../components/content-input';
import FollowComponent from '../components/follow';
import followReducer from '../reducers/follow';
import operations from '../operations';
import messages from './messages';

const followStore = store.createStore(followReducer);
const followComponent = new FollowComponent(window.document.body, followStore);
followStore.subscribe(() => {
  try {
    followComponent.update();
  } catch (e) {
    console.error(e);
  }
});
// eslint-disable-next-line no-unused-vars
const contentInputComponent = new ContentInputComponent(window);

consoleFrames.initialize(window.document);

const execOperation = (operation) => {
  switch (operation.type) {
  case operations.SCROLL_LINES:
    return scrolls.scrollLines(window, operation.count);
  case operations.SCROLL_PAGES:
    return scrolls.scrollPages(window, operation.count);
  case operations.SCROLL_TOP:
    return scrolls.scrollTop(window);
  case operations.SCROLL_BOTTOM:
    return scrolls.scrollBottom(window);
  case operations.SCROLL_HOME:
    return scrolls.scrollLeft(window);
  case operations.SCROLL_END:
    return scrolls.scrollRight(window);
  case operations.FOLLOW_START:
    return followStore.dispatch(followActions.enable(false));
  case operations.NAVIGATE_HISTORY_PREV:
    return navigates.historyPrev(window);
  case operations.NAVIGATE_HISTORY_NEXT:
    return navigates.historyNext(window);
  case operations.NAVIGATE_LINK_PREV:
    return navigates.linkPrev(window);
  case operations.NAVIGATE_LINK_NEXT:
    return navigates.linkNext(window);
  case operations.NAVIGATE_PARENT:
    return navigates.parent(window);
  case operations.NAVIGATE_ROOT:
    return navigates.root(window);
  }
};

const update = (state) => {
  if (!state.console.commandShown) {
    window.focus();
    consoleFrames.blur(window.document);
  }
};

browser.runtime.onMessage.addListener((action) => {
  switch (action.type) {
  case messages.STATE_UPDATE:
    return update(action.state);
  case messages.CONTENT_OPERATION:
    execOperation(action.operation);
    return Promise.resolve();
  default:
    return Promise.resolve();
  }
});
