import * as tabs from '../background/tabs';
import actions from '../actions';

const cmdBuffer = (tab, arg) => {
  if (isNaN(arg)) {
    return tabs.selectByKeyword(tab, arg);
  } else {
    let index = parseInt(arg, 10) - 1;
    return tabs.selectAt(index);
  }
}

export default function reducer(state, action, sendToTab) {
  switch (action.type) {
  case actions.COMMAND_OPEN_URL:
    return browser.tabs.update(sendToTab.id, { url: action.url });
  case actions.COMMAND_TABOPEN_URL:
    return browser.tabs.create({ url: action.url });
  case actions.COMMAND_BUFFER:
    return cmdBuffer(sendToTab, action.keywords);
  default:
    return Promise.resolve();
  }
}
