import * as tabs from './tabs';

const KEY_MAP = {
  'tabs.prev': 104,
  'tabs.next': 108
};

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.key) {
  case KEY_MAP['tabs.prev']:
    tabs.selectPrevTab(sender.tab.index);
    break;
  case KEY_MAP['tabs.next']:
    tabs.selectNextTab(sender.tab.index);
    break;
  }
  sendResponse();
});
