import * as tabs from '../background/tabs';
import * as consoleActions from '../actions/console';
import actions from '../actions';

const doCompletion = (command, keywords, tabId) => {
  if (command === 'buffer') {
    return tabs.getCompletions(keywords).then((tabs) => {
      let items = tabs.map((tab) => {
        return {
          caption: tab.title,
          content: tab.title,
          url: tab.url,
          icon: tab.favIconUrl
        }
      });
      let completions = {
        name: "Buffers",
        items: items
      };
      return browser.tabs.sendMessage(
        tabId,
        consoleActions.setCompletions([completions]));
    });
  }
  return Promise.resolve();
};

export default function reducer(state, action = {}, sendToTab) {
  // TODO hide sender object
  switch (action.type) {
  case actions.BACKGROUND_REQUEST_COMPLETIONS:
    return doCompletion(action.command, action.keywords, sendToTab.id);
  default:
    return Promise.resolve();
  }
}
