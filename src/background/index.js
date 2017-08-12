import * as tabs from './tabs';

const KEY_MAP = {
  'tabs.prev': 104,
  'tabs.next': 108,
  'scroll.up': 107,
  'scroll.down': 106
};

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  let response = null;

  switch (request.key) {
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
