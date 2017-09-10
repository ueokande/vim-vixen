import * as actions from '../shared/actions';
import * as tabs from './tabs';
import * as zooms from './zooms';
import KeyQueue from './key-queue';
import backgroundReducers from '../reducers/background';

const queue = new KeyQueue();

const keyPressHandle = (request, sender) => {
  let action = queue.push({
    code: request.code,
    ctrl: request.ctrl
  });
  if (!action) {
    return Promise.resolve();
  }

  if (actions.isBackgroundAction(action.type)) {
    return doBackgroundAction(sender, action);
  } else if (actions.isContentAction(action.type)) {
    return browser.tabs.sendMessage(sender.tab.id, action);
  }
  return Promise.resolve();
};

const doBackgroundAction = (sender, action) => {
  switch(action.type) {
  case actions.TABS_CLOSE:
    return tabs.closeTab(sender.tab.id);
  case actions.TABS_REOPEN:
    return tabs.reopenTab();
  case actions.TABS_PREV:
    return tabs.selectPrevTab(sender.tab.index, action.count);
  case actions.TABS_NEXT:
    return tabs.selectNextTab(sender.tab.index, action.count);
  case actions.TABS_RELOAD:
    return tabs.reload(sender.tab, actions.cache);
  case actions.ZOOM_IN:
    return zooms.zoomIn();
  case actions.ZOOM_OUT:
    return zooms.zoomOut();
  case actions.ZOOM_NEUTRAL:
    return zooms.neutral();
  }
  return Promise.resolve();
}

const normalizeUrl = (string) => {
  try {
    return new URL(string).href
  } catch (e) {
    return 'http://' + string;
  }
}

const cmdBuffer = (sender, arg) => {
  if (isNaN(arg)) {
    return tabs.selectByKeyword(sender.tab, arg);
  } else {
    let index = parseInt(arg, 10) - 1;
    return tabs.selectAt(index);
  }
}

const cmdEnterHandle = (request, sender) => {
  let words = request.text.split(' ').filter((s) => s.length > 0);
  switch (words[0]) {
  case 'open':
    return browser.tabs.update(sender.tab.id, { url: normalizeUrl(words[1]) });
  case 'tabopen':
    return browser.tabs.create({ url: normalizeUrl(words[1]) });
  case 'b':
  case 'buffer':
    return cmdBuffer(sender, words[1]);
  }
  throw new Error(words[0] + ' command is not defined');
};

browser.runtime.onMessage.addListener((request, sender) => {
  switch (request.type) {
  case 'event.keypress':
    return keyPressHandle(request, sender);
  case 'event.cmd.enter':
    return cmdEnterHandle(request, sender);
  default:
    return browser.tabs.sendMessage(sender.tab.id, request);
  }
});

browser.runtime.onMessage.addListener((action, sender) => {
  return backgroundReducers(undefined, action, sender.tab.id);
});
