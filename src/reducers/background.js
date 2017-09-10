import * as tabs from '../background/tabs';
import * as zooms from '../background/zooms';
import * as consoleActions from '../actions/console';
import actions from '../actions';

const doCompletion = (command, keywords, sender) => {
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
        sender,
        consoleActions.setCompletions([completions]));
    });
  }
  return Promise.resolve();
};

export default function reducer(state, action = {}, sender) {
  // TODO hide sender object
  switch (action.type) {
  case actions.BACKGROUND_REQUEST_COMPLETIONS:
    return doCompletion(action.command, action.keywords, sender.tab.id);
  case actions.TABS_CLOSE:
    return tabs.closeTab(sender.tab.id);
  case actions.TABS_REOPEN:
    return tabs.reopenTab();
  case actions.TABS_PREV:
    return tabs.selectPrevTab(sender.tab.index, action.count);
  case actions.TABS_NEXT:
    return tabs.selectNextTab(sender.tab.index, action.count);
  case actions.TABS_RELOAD:
    return tabs.reload(sender.tab, action.cache);
  case actions.ZOOM_IN:
    return zooms.zoomIn();
  case actions.ZOOM_OUT:
    return zooms.zoomOut();
  case actions.ZOOM_NEUTRAL:
    return zooms.neutral();
  default:
    return Promise.resolve();
  }
}
