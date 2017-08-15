import * as actions from '../shared/actions';
import * as tabs from './tabs';
import KeyQueue from './key-queue';

const queue = new KeyQueue();

const keyDownHandle = (request) => {
  return queue.push({
    code: request.code,
    shift: request.shift,
    ctrl: request.ctrl,
    alt: request.alt,
    meta: request.meta
  })
}

const doBackgroundAction = (sender, action) => {
  switch(action[0]) {
  case actions.TABS_PREV:
    tabs.selectPrevTab(sender.tab.index, actions[1] || 1);
    break;
  case actions.TABS_NEXT:
    tabs.selectNextTab(sender.tab.index, actions[1] || 1);
    break;
  }
}

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  let action = null;

  switch (request.type) {
  case 'event.keydown':
    action = keyDownHandle(request);
    break;
  }

  if (action == null) {
    return;
  }

  if (actions.isBackgroundAction(action[0])) {
    doBackgroundAction(sender, action);
  } else if (actions.isContentAction(action[0])) {
    sendResponse(action);
  }
});
