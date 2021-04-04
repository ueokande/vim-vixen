import { Command } from "../../shared/Command";
import CompletionClient from "../clients/CompletionClient";
import CompletionType from "../../shared/CompletionType";
import Completions from "../Completions";
import TabFlag from "../../shared/TabFlag";

const completionClient = new CompletionClient();

const commandDocs = {
  [Command.Set]: "Set a value of the property",
  [Command.Open]: "Open a URL or search by keywords in current tab",
  [Command.TabOpen]: "Open a URL or search by keywords in new tab",
  [Command.WindowOpen]: "Open a URL or search by keywords in new window",
  [Command.Buffer]: "Select tabs by matched keywords",
  [Command.BufferDelete]: "Close a certain tab matched by keywords",
  [Command.BuffersDelete]: "Close all tabs matched by keywords",
  [Command.Quit]: "Close the current tab",
  [Command.QuitAll]: "Close all tabs",
  [Command.AddBookmark]: "Add current page to bookmarks",
  [Command.Help]: "Open Vim Vixen help in new tab",
};

const propertyDocs: { [key: string]: string } = {
  hintchars: "hint characters on follow mode",
  smoothscroll: "smooth scroll",
  complete: "which are completed at the open page",
  colorscheme: "color scheme of the console",
};

export const COMPLETION_START_COMPLETION = "console.start.completion";
export const COMPLETION_SET_COMPLETIONS = "console.set.completions";
export const COMPLETION_COMPLETION_NEXT = "completion.completion.next";
export const COMPLETION_COMPLETION_PREV = "completion.completion.prev";

export interface CompletionStartCompletionAction {
  type: typeof COMPLETION_START_COMPLETION;
  completionTypes: CompletionType[];
}

export interface SetCompletionsAction {
  type: typeof COMPLETION_SET_COMPLETIONS;
  completions: Completions;
  completionSource: string;
}

export interface CompletionNextAction {
  type: typeof COMPLETION_COMPLETION_NEXT;
}

export interface CompletionPrevAction {
  type: typeof COMPLETION_COMPLETION_PREV;
}

export type CompletionAction =
  | CompletionStartCompletionAction
  | SetCompletionsAction
  | CompletionNextAction
  | CompletionPrevAction;
const startCompletion = async (): Promise<CompletionStartCompletionAction> => {
  const completionTypes = await completionClient.getCompletionTypes();
  return {
    type: COMPLETION_START_COMPLETION,
    completionTypes,
  };
};

const getCommandCompletions = (text: string): SetCompletionsAction => {
  const items = Object.entries(commandDocs)
    .filter(([name]) => name.startsWith(text.trimLeft()))
    .map(([name, doc]) => ({
      caption: name,
      content: name,
      url: doc,
    }));
  const completions = [
    {
      name: "Console Command",
      items,
    },
  ];
  return {
    type: COMPLETION_SET_COMPLETIONS,
    completions,
    completionSource: text,
  };
};

const getOpenCompletions = async (
  types: CompletionType[],
  original: string,
  command: Command,
  query: string
): Promise<SetCompletionsAction> => {
  const completions: Completions = [];
  for (const type of types) {
    switch (type) {
      case CompletionType.SearchEngines: {
        const items = await completionClient.requestSearchEngines(query);
        if (items.length === 0) {
          break;
        }
        completions.push({
          name: "Search Engines",
          items: items.map((key) => ({
            caption: key.title,
            content: command + " " + key.title,
          })),
        });
        break;
      }
      case CompletionType.History: {
        const items = await completionClient.requestHistory(query);
        if (items.length === 0) {
          break;
        }
        completions.push({
          name: "History",
          items: items.map((item) => ({
            caption: item.title,
            content: command + " " + item.url,
            url: item.url,
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
          name: "Bookmarks",
          items: items.map((item) => ({
            caption: item.title,
            content: command + " " + item.url,
            url: item.url,
          })),
        });
        break;
      }
    }
  }

  return {
    type: COMPLETION_SET_COMPLETIONS,
    completions,
    completionSource: original,
  };
};

const getTabCompletions = async (
  original: string,
  command: Command,
  query: string,
  excludePinned: boolean
): Promise<SetCompletionsAction> => {
  const items = await completionClient.requestTabs(query, excludePinned);
  let completions: Completions = [];
  if (items.length > 0) {
    completions = [
      {
        name: "Buffers",
        items: items.map((item) => ({
          content: command + " " + item.url,
          caption: `${item.index}: ${
            item.flag != TabFlag.None ? item.flag : " "
          } ${item.title}`,
          url: item.url,
          icon: item.faviconUrl,
        })),
      },
    ];
  }
  return {
    type: COMPLETION_SET_COMPLETIONS,
    completions,
    completionSource: original,
  };
};

const getPropertyCompletions = async (
  original: string,
  command: Command,
  query: string
): Promise<SetCompletionsAction> => {
  const properties = await completionClient.getProperties();
  const items = properties
    .map((item) => {
      const desc = propertyDocs[item.name] || "";
      if (item.type === "boolean") {
        return [
          {
            caption: item.name,
            content: command + " " + item.name,
            url: "Enable " + desc,
          },
          {
            caption: "no" + item.name,
            content: command + " no" + item.name,
            url: "Disable " + desc,
          },
        ];
      } else {
        return [
          {
            caption: item.name,
            content: command + " " + item.name,
            url: "Set " + desc,
          },
        ];
      }
    })
    .reduce((acc, val) => acc.concat(val), [])
    .filter((item) => item.caption.startsWith(query));
  const completions: Completions = [{ name: "Properties", items }];
  return {
    type: COMPLETION_SET_COMPLETIONS,
    completions,
    completionSource: original,
  };
};

const completionNext = (): CompletionNextAction => {
  return {
    type: COMPLETION_COMPLETION_NEXT,
  };
};

const completionPrev = (): CompletionPrevAction => {
  return {
    type: COMPLETION_COMPLETION_PREV,
  };
};

export {
  startCompletion,
  getCommandCompletions,
  getOpenCompletions,
  getTabCompletions,
  getPropertyCompletions,
  completionNext,
  completionPrev,
};
