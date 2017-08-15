import * as actions from '../shared/actions';
import * as tabs from './tabs';
import * as commands from './commands';
import KeyQueue from './key-queue';

const queue = new KeyQueue();

const keyDownHandle = (request, sender, sendResponse) => {
  let action = queue.push({
    code: request.code,
    shift: request.shift,
    ctrl: request.ctrl,
    alt: request.alt,
    meta: request.meta
  });
  if (!action) {
    return;
  }

  if (actions.isBackgroundAction(action[0])) {
    doBackgroundAction(sender, action);
  } else if (actions.isContentAction(action[0])) {
    sendResponse(action);
  }
};

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

const normalizeUrl = (string) => {
  try {
    return new URL(string).href
  } catch (e) {
    return 'http://' + string;
  }
}

const cmdEnterHandle = (request, sender) => {
  let words = request.text.split(' ').filter((s) => s.length > 0);
  switch (words[0]) {
  case commands.OPEN:
    browser.tabs.update(sender.tab.id, { url: normalizeUrl(words[1]) });
    return;
  case commands.TABOPEN:
    browser.tabs.create({ url: normalizeUrl(words[1]) });
    return;
  }
};

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.type) {
  case 'event.keydown':
    keyDownHandle(request, sender, sendResponse);
    break;
  case 'event.cmd.enter':
    cmdEnterHandle(request, sender, sendResponse);
    break;
  case 'event.cmd.suggest':
    // TODO make suggestion and return via sendResponse
    break;
  }
});
