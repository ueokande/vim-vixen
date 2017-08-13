import * as tabs from './tabs';

const KEY_MAP = {
  'tabs.prev': KeyboardEvent.DOM_VK_H,
  'tabs.next': KeyboardEvent.DOM_VK_L,
  'scroll.up': KeyboardEvent.DOM_VK_K,
  'scroll.down': KeyboardEvent.DOM_VK_J
};

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  let response = null;

  switch (request.code) {
  case KEY_MAP['tabs.prev']:
    tabs.selectPrevTab(sender.tab.index);
    break;
  case KEY_MAP['tabs.next']:
    tabs.selectNextTab(sender.tab.index);
    break;
  case KEY_MAP['scroll.up']:
    response = 'scroll.up'
    break;
  case KEY_MAP['scroll.down']:
    response = 'scroll.down'
    break;
  }
  sendResponse(response);
});
