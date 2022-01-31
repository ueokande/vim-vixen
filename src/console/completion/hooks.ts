import React from "react";
import * as actions from "./actions";
import { Command } from "../../shared/Command";
import TabFlag from "../../shared/TabFlag";
import { CompletionStateContext, CompletionDispatchContext } from "./context";
import CompletionClient from "../clients/CompletionClient";
import CommandLineParser, {
  CommandLine,
  InputPhase,
} from "../commandline/CommandLineParser";
import { UnknownCommandError } from "../commandline/CommandParser";
import Completions from "../Completions";
import CompletionType from "../../shared/CompletionType";

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

const completionClient = new CompletionClient();

// useSampledCallback provides a hooks to reduce high-loaded function calls.
// It ignore function calls between called within minDuration, so that allow to
// reduce function calls.
//
// The callback specified in the hook is called via invoke() function which the hooks returns,
// but the calls within minDuration (100ms) are ignored.
const useSampledCallback = <T1 extends unknown, T2 extends unknown>(
  callback: (...args: [T1, T2]) => Promise<void>,
  minDuration: number
) => {
  const [timer, setTimer] = React.useState<
    ReturnType<typeof setTimeout> | undefined
  >();
  const synchronize = React.useCallback((...args: [T1, T2]): Promise<void> => {
    clearTimeout(timer!);
    setTimer(undefined);
    return callback.apply(this, args);
  }, []);

  const fire = React.useCallback(
    (...args: [T1, T2]) => {
      if (typeof timer !== "undefined") {
        clearTimeout(timer!);
      }
      const id = setTimeout(() => {
        callback.apply(this, args);
        clearTimeout(timer!);
        setTimer(undefined);
      }, minDuration);
      setTimer(id);
    },
    [timer]
  );

  return { fire, synchronize };
};

const getCommandCompletions = async (query: string): Promise<Completions> => {
  const items = Object.entries(commandDocs)
    .filter(([name]) => name.startsWith(query))
    .map(([name, doc]) => ({
      caption: name,
      content: name,
      url: doc,
    }));
  return [
    {
      name: "Console Command",
      items,
    },
  ];
};

const getOpenCompletions = async (
  command: string,
  query: string,
  completionTypes: CompletionType[]
): Promise<Completions> => {
  const completions: Completions = [];
  for (const type of completionTypes) {
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
  return completions;
};

export const getTabCompletions = async (
  command: string,
  query: string,
  excludePinned: boolean
): Promise<Completions> => {
  const items = await completionClient.requestTabs(query, excludePinned);
  if (items.length === 0) {
    return [];
  }

  return [
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
};

export const getPropertyCompletions = async (
  command: string,
  query: string
): Promise<Completions> => {
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
  return [{ name: "Properties", items }];
};

export const useCompletions = () => {
  const state = React.useContext(CompletionStateContext);
  const dispatch = React.useContext(CompletionDispatchContext);
  const commandLineParser = React.useMemo(() => new CommandLineParser(), []);

  const updateCompletions = React.useCallback((source: string) => {
    dispatch(actions.setCompletionSource(source));
  }, []);

  const initCompletion = React.useCallback((source: string) => {
    completionClient.getCompletionTypes().then((completionTypes) => {
      dispatch(actions.initCompletion(completionTypes));
      dispatch(actions.setCompletionSource(source));
    });
  }, []);
  const getRemoteCompletions = React.useCallback(
    (text: string, completionTypes?: CompletionType[]): Promise<void> => {
      let cmd: CommandLine | null = null;
      try {
        cmd = commandLineParser.parse(text);
      } catch (e) {
        if (e instanceof UnknownCommandError) {
          return Promise.resolve();
        }
        return Promise.reject(e);
      }
      switch (cmd?.command) {
        case Command.Open:
        case Command.TabOpen:
        case Command.WindowOpen:
          if (!completionTypes) {
            initCompletion(text);
            return Promise.resolve();
          }

          return getOpenCompletions(
            cmd.command,
            cmd.args,
            completionTypes
          ).then((completions) =>
            dispatch(actions.setCompletions(completions))
          );
        case Command.Buffer:
          return getTabCompletions(cmd.command, cmd.args, false).then(
            (completions) => dispatch(actions.setCompletions(completions))
          );
        case Command.BufferDelete:
        case Command.BuffersDelete:
          return getTabCompletions(cmd.command, cmd.args, true).then(
            (completions) => dispatch(actions.setCompletions(completions))
          );
        case Command.BufferDeleteForce:
        case Command.BuffersDeleteForce:
          return getTabCompletions(cmd.command, cmd.args, false).then(
            (completions) => dispatch(actions.setCompletions(completions))
          );
        case Command.Set:
          return getPropertyCompletions(cmd.command, cmd.args).then(
            (completions) => dispatch(actions.setCompletions(completions))
          );
      }
      return Promise.resolve();
    },
    [dispatch]
  );

  const getCompletion = React.useCallback(
    (text: string, completionTypes?: CompletionType[]): Promise<void> => {
      const phase = commandLineParser.inputPhase(text);
      if (phase === InputPhase.OnCommand) {
        return getCommandCompletions(text).then((completions) =>
          dispatch(actions.setCompletions(completions))
        );
      } else {
        return getRemoteCompletions(text, completionTypes);
      }
    },
    []
  );

  const { fire: asyncGetCompletions, synchronize: syncGetCompletions } =
    useSampledCallback(getCompletion, 100);

  React.useEffect(() => {
    asyncGetCompletions(state.completionSource, state.completionTypes);
  }, [state.completionSource, state.completionTypes]);

  const synchronise = React.useCallback(() => {
    return syncGetCompletions(state.completionSource, state.completionTypes);
  }, [state.completionSource, state.completionTypes]);

  return {
    completions: state.completions,
    updateCompletions,
    syncCompletions: synchronise,
  };
};

export const useSelectCompletion = () => {
  const state = React.useContext(CompletionStateContext);
  const dispatch = React.useContext(CompletionDispatchContext);
  const next = React.useCallback(
    () => dispatch(actions.selectNext()),
    [dispatch]
  );
  const prev = React.useCallback(
    () => dispatch(actions.selectPrev()),
    [dispatch]
  );
  const currentValue = React.useMemo(() => {
    if (state.select < 0) {
      return state.completionSource;
    }
    const items = state.completions.map((g) => g.items).flat();
    return items[state.select]?.content || "";
  }, [state.completionSource, state.select]);

  return {
    select: state.select,
    currentValue,
    selectNext: next,
    selectPrev: prev,
  };
};
