import * as tabs from '../background/tabs';
import * as consoleActions from '../actions/console';
import actions from '../actions';

const doCompletion = (command, keywords, sendto) => {
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
        sendto, 
        consoleActions.setCompletions([completions]));
    });
  }
  return Promise.resolve();
};



export default function reducer(state, action = {}, sendto) {
  // TODO hide sendto object
  switch (action.type) {
  case actions.BACKGROUND_REQUEST_COMPLETIONS:
    return doCompletion(action.command, action.keywords, sendto);
  default:
    return Promise.resolve();
  }
}
