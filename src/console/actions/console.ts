import * as messages from '../../shared/messages';
import * as actions from './index';
import {Command} from "../../shared/Command";
import CompletionClient from "../clients/CompletionClient";
import CompletionType from "../../shared/CompletionType";
import Completions from "../Completions";
import TabFlag from "../../shared/TabFlag";

const completionClient = new CompletionClient();

const commandDocs = {
  [Command.Set]: 'Set a value of the property',
  [Command.Open]: 'Open a URL or search by keywords in current tab',
  [Command.TabOpen]: 'Open a URL or search by keywords in new tab',
  [Command.WindowOpen]: 'Open a URL or search by keywords in new window',
  [Command.Buffer]: 'Select tabs by matched keywords',
  [Command.BufferDelete]: 'Close a certain tab matched by keywords',
  [Command.BuffersDelete]: 'Close all tabs matched by keywords',
  [Command.Quit]: 'Close the current tab',
  [Command.QuitAll]: 'Close all tabs',
  [Command.AddBookmark]: 'Add current page to bookmarks',
  [Command.Help]: 'Open Vim Vixen help in new tab',
};

const hide = (): actions.ConsoleAction => {
  return {
    type: actions.CONSOLE_HIDE,
  };
};

const showCommand = async (text: string): Promise<actions.ShowCommand> => {
  const completionTypes = await completionClient.getCompletionTypes();
  return {
    type: actions.CONSOLE_SHOW_COMMAND,
    completionTypes,
    text,
  };
};

const showFind = (): actions.ShowFindAction => {
  return {
    type: actions.CONSOLE_SHOW_FIND,
  };
};

const showError = (text: string): actions.ShowErrorAction => {
  return {
    type: actions.CONSOLE_SHOW_ERROR,
    text: text
  };
};

const showInfo = (text: string): actions.ShowInfoAction => {
  return {
    type: actions.CONSOLE_SHOW_INFO,
    text: text
  };
};

const hideCommand = (): actions.HideCommandAction => {
  window.top.postMessage(JSON.stringify({
    type: messages.CONSOLE_UNFOCUS,
  }), '*');
  return {
    type: actions.CONSOLE_HIDE_COMMAND,
  };
};

const enterCommand = async(text: string): Promise<actions.HideCommandAction> => {
  await browser.runtime.sendMessage({
    type: messages.CONSOLE_ENTER_COMMAND,
    text,
  });
  return hideCommand();
};

const enterFind = (text?: string): actions.HideCommandAction => {
  window.top.postMessage(JSON.stringify({
    type: messages.CONSOLE_ENTER_FIND,
    text,
  }), '*');
  return hideCommand();
};

const setConsoleText = (consoleText: string): actions.SetConsoleTextAction => {
  return {
    type: actions.CONSOLE_SET_CONSOLE_TEXT,
    consoleText,
  };
};

const getCommandCompletions = (text: string): actions.SetCompletionsAction => {
  const items = Object.entries(commandDocs)
      .filter(([name]) => name.startsWith(text.trimLeft()))
      .map(([name, doc]) => ({
          caption: name,
          content: name,
          url: doc,
        }));
  const completions = [{
    name: "Console Command",
    items,
  }];
  return {
    type: actions.CONSOLE_SET_COMPLETIONS,
    completions,
    completionSource: text,
  }
};

const getOpenCompletions = async(
    types: CompletionType[], original: string, command: Command, query: string,
): Promise<actions.SetCompletionsAction> => {
  const completions: Completions = [];
  for (const type of types) {
    switch (type) {
      case CompletionType.SearchEngines: {
        const items = await completionClient.requestSearchEngines(query);
        if (items.length === 0) {
          break;
        }
        completions.push({
          name: 'Search Engines',
          items: items.map(key => ({
            caption: key.title,
            content: command + ' ' + key.title,
          }))
        });
        break;
      }
      case CompletionType.History: {
        const items = await completionClient.requestHistory(query);
        if (items.length === 0) {
          break;
        }
        completions.push({
          name: 'History',
          items: items.map(item => ({
            caption: item.title,
            content: command + ' ' + item.url,
            url: item.url
          })),
        });
        break;
      }
      case CompletionType.Bookmarks: {
        const items = await completionClient.requestBookmarks(query);
        if (items.length === 0) {
          break;
        }
        completions.push({
          name: 'Bookmarks',
          items: items.map(item => ({
            caption: item.title,
            content: command + ' ' + item.url,
            url: item.url
          }))
        });
        break;
      }
    }
  }

  return {
    type: actions.CONSOLE_SET_COMPLETIONS,
    completions,
    completionSource: original,
  };
};

const getTabCompletions = async (
  original: string, command: Command, query: string, excludePinned: boolean,
): Promise<actions.SetCompletionsAction> => {
    const items = await completionClient.requestTabs(query, excludePinned);
    let completions: Completions = [];
    if (items.length > 0) {
      completions = [{
        name: 'Buffers',
        items: items.map(item => ({
          content: command + ' ' + item.url,
          caption: `${item.index}: ${item.flag != TabFlag.None ? item.flag : ' ' } ${item.title}`,
          url: item.url,
          icon: item.faviconUrl,
        })),
      }];
    }
    return {
      type: actions.CONSOLE_SET_COMPLETIONS,
      completions,
      completionSource: original,
    }
};



const getCompletions = async(text: string): Promise<actions.SetCompletionsAction> => {
  const completions = await browser.runtime.sendMessage({
    type: messages.CONSOLE_QUERY_COMPLETIONS,
    text,
  });
  return {
    type: actions.CONSOLE_SET_COMPLETIONS,
    completions,
    completionSource: text,
  };
};

const completionNext = (): actions.CompletionNextAction => {
  return {
    type: actions.CONSOLE_COMPLETION_NEXT,
  };
};

const completionPrev = (): actions.CompletionPrevAction => {
  return {
    type: actions.CONSOLE_COMPLETION_PREV,
  };
};

export {
  hide, showCommand, showFind, showError, showInfo, hideCommand, setConsoleText, enterCommand, enterFind,
  getCompletions, getCommandCompletions, getOpenCompletions, getTabCompletions,
  completionNext, completionPrev,
};
