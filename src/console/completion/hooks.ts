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
import { useGetCompletionTypes } from "./hooks/clients";

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

const useDelayedCallback = <T extends unknown, U extends unknown>(
  callback: (arg1: T, arg2: U) => void,
  timeout: number
) => {
  const [timer, setTimer] = React.useState<
    ReturnType<typeof setTimeout> | undefined
  >();
  const [enabled, setEnabled] = React.useState(false);

  const enableDelay = React.useCallback(() => {
    setEnabled(true);
  }, [setEnabled]);

  const delayedCallback = React.useCallback(
    (arg1: T, arg2: U) => {
      if (enabled) {
        if (typeof timer !== "undefined") {
          clearTimeout(timer);
        }
        const id = setTimeout(() => {
          callback(arg1, arg2);
          clearTimeout(timer!);
          setTimer(undefined);
        }, timeout);
        setTimer(id);
      } else {
        callback(arg1, arg2);
      }
    },
    [enabled, timer]
  );

  return { enableDelay, delayedCallback };
};

const getCommandCompletions = async (query: string): Promise<Completions> => {
  const items = Object.entries(commandDocs)
    .filter(([name]) => name.startsWith(query))
    .map(([name, doc]) => ({
      primary: name,
      secondary: doc,
      value: name,
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
            primary: key.title,
            value: command + " " + key.title,
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
            primary: item.title,
            secondary: item.url,
            value: command + " " + item.url,
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
            primary: item.title,
            secondary: item.url,
            value: command + " " + item.url,
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
        primary: `${item.index}: ${
          item.flag != TabFlag.None ? item.flag : " "
        } ${item.title}`,
        secondary: item.url,
        value: command + " " + item.url,
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
            primary: item.name,
            secondary: "Enable " + desc,
            value: command + " " + item.name,
          },
          {
            primary: "no" + item.name,
            secondary: "Disable " + desc,
            value: command + " no" + item.name,
          },
        ];
      } else {
        return [
          {
            primary: item.name,
            secondary: "Set " + desc,
            value: command + " " + item.name,
          },
        ];
      }
    })
    .reduce((acc, val) => acc.concat(val), [])
    .filter((item) => item.primary.startsWith(query));
  return [{ name: "Properties", items }];
};

export const useCompletions = () => {
  const state = React.useContext(CompletionStateContext);
  const dispatch = React.useContext(CompletionDispatchContext);
  const commandLineParser = React.useMemo(() => new CommandLineParser(), []);
  const [completionTypes] = useGetCompletionTypes();

  const updateCompletions = React.useCallback((source: string) => {
    dispatch(actions.setCompletionSource(source));
  }, []);

  const { delayedCallback: queryCompletions, enableDelay } = useDelayedCallback(
    React.useCallback(
      (text: string, completionTypes: CompletionType[]) => {
        const phase = commandLineParser.inputPhase(text);
        if (phase === InputPhase.OnCommand) {
          getCommandCompletions(text).then((completions) =>
            dispatch(actions.setCompletions(completions))
          );
        } else {
          let cmd: CommandLine | null = null;
          try {
            cmd = commandLineParser.parse(text);
          } catch (e) {
            if (e instanceof UnknownCommandError) {
              return;
            }
          }
          switch (cmd?.command) {
            case Command.Open:
            case Command.TabOpen:
            case Command.WindowOpen:
              getOpenCompletions(cmd.command, cmd.args, completionTypes).then(
                (completions) => dispatch(actions.setCompletions(completions))
              );
              break;
            case Command.Buffer:
              getTabCompletions(cmd.command, cmd.args, false).then(
                (completions) => dispatch(actions.setCompletions(completions))
              );
              break;
            case Command.BufferDelete:
            case Command.BuffersDelete:
              getTabCompletions(cmd.command, cmd.args, true).then(
                (completions) => dispatch(actions.setCompletions(completions))
              );
              break;
            case Command.BufferDeleteForce:
            case Command.BuffersDeleteForce:
              getTabCompletions(cmd.command, cmd.args, false).then(
                (completions) => dispatch(actions.setCompletions(completions))
              );
              break;
            case Command.Set:
              getPropertyCompletions(cmd.command, cmd.args).then(
                (completions) => dispatch(actions.setCompletions(completions))
              );
              break;
          }
          enableDelay();
        }
      },
      [dispatch]
    ),
    100
  );

  React.useEffect(() => {
    if (typeof completionTypes === "undefined") {
      return;
    }
    queryCompletions(state.completionSource, completionTypes);
  }, [state.completionSource, completionTypes]);

  return {
    completions: state.completions,
    updateCompletions,
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
    return items[state.select]?.value || "";
  }, [state.completionSource, state.select]);

  return {
    select: state.select,
    currentValue,
    selectNext: next,
    selectPrev: prev,
  };
};
