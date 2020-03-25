import * as messages from '../../shared/messages';
import * as actions from './index';
import { Command } from "../../shared/Command";

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

const showCommand = (text: string): actions.ConsoleAction => {
  return {
    type: actions.CONSOLE_SHOW_COMMAND,
    text: text
  };
};

const showFind = (): actions.ConsoleAction => {
  return {
    type: actions.CONSOLE_SHOW_FIND,
  };
};

const showError = (text: string): actions.ConsoleAction => {
  return {
    type: actions.CONSOLE_SHOW_ERROR,
    text: text
  };
};

const showInfo = (text: string): actions.ConsoleAction => {
  return {
    type: actions.CONSOLE_SHOW_INFO,
    text: text
  };
};

const hideCommand = (): actions.ConsoleAction => {
  window.top.postMessage(JSON.stringify({
    type: messages.CONSOLE_UNFOCUS,
  }), '*');
  return {
    type: actions.CONSOLE_HIDE_COMMAND,
  };
};

const enterCommand = async(
  text: string,
): Promise<actions.ConsoleAction> => {
  await browser.runtime.sendMessage({
    type: messages.CONSOLE_ENTER_COMMAND,
    text,
  });
  return hideCommand();
};

const enterFind = (text?: string): actions.ConsoleAction => {
  window.top.postMessage(JSON.stringify({
    type: messages.CONSOLE_ENTER_FIND,
    text,
  }), '*');
  return hideCommand();
};

const setConsoleText = (consoleText: string): actions.ConsoleAction => {
  return {
    type: actions.CONSOLE_SET_CONSOLE_TEXT,
    consoleText,
  };
};

const getCommandCompletions = (text: string): actions.ConsoleAction => {
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


const getCompletions = async(text: string): Promise<actions.ConsoleAction> => {
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

const completionNext = (): actions.ConsoleAction => {
  return {
    type: actions.CONSOLE_COMPLETION_NEXT,
  };
};

const completionPrev = (): actions.ConsoleAction => {
  return {
    type: actions.CONSOLE_COMPLETION_PREV,
  };
};

export {
  hide, showCommand, showFind, showError, showInfo, hideCommand, setConsoleText,
  enterCommand, enterFind, getCompletions, getCommandCompletions, completionNext, completionPrev,
};
