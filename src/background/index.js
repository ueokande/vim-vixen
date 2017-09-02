import * as actions from '../shared/actions';
import * as tabs from './tabs';
import * as zooms from './zooms';
import KeyQueue from './key-queue';

const queue = new KeyQueue();

const keyPressHandle = (request, sender, sendResponse) => {
  let action = queue.push({
    code: request.code,
    ctrl: request.ctrl
  });
  if (!action) {
    return;
  }

  if (actions.isBackgroundAction(action[0])) {
    doBackgroundAction(sender, action);
  } else if (actions.isContentAction(action[0])) {
    sendResponse({
      type: 'response.action',
      action: action
    });
  }
};

const doBackgroundAction = (sender, action) => {
  switch(action[0]) {
  case actions.TABS_CLOSE:
    tabs.closeTab(sender.tab.id);
    break;
  case actions.TABS_REOPEN:
    tabs.reopenTab();
    break;
  case actions.TABS_PREV:
    tabs.selectPrevTab(sender.tab.index, actions[1] || 1);
    break;
  case actions.TABS_NEXT:
    tabs.selectNextTab(sender.tab.index, actions[1] || 1);
    break;
  case actions.TABS_RELOAD:
    tabs.reload(sender.tab, actions[1] || false);
    break;
  case actions.ZOOM_IN:
    zooms.zoomIn();
    break;
  case actions.ZOOM_OUT:
    zooms.zoomOut();
    break;
  case actions.ZOOM_NEUTRAL:
    zooms.neutral();
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

const cmdBuffer = (arg) => {
  if (isNaN(arg)) {
    tabs.selectByKeyword(arg);
  } else {
    let index = parseInt(arg, 10) - 1;
    tabs.selectAt(index);
  }
}

const cmdEnterHandle = (request, sender) => {
  let words = request.text.split(' ').filter((s) => s.length > 0);
  switch (words[0]) {
  case 'open':
    browser.tabs.update(sender.tab.id, { url: normalizeUrl(words[1]) });
    return;
  case 'tabopen':
    browser.tabs.create({ url: normalizeUrl(words[1]) });
    return;
  case 'b':
  case 'buffer':
    cmdBuffer(words[1]);
    return;
  }
};

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.type) {
  case 'event.keypress':
    keyPressHandle(request, sender, sendResponse);
    break;
  case 'event.cmd.enter':
    cmdEnterHandle(request, sender, sendResponse);
    break;
  case 'event.cmd.suggest':
    // TODO make suggestion and return via sendResponse
    break;
  }
});
