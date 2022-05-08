import * as messages from "../shared/messages";
import Console from "./components/Console";
import React from "react";
import {
  useCommandMode,
  useFindMode,
  useInfoMessage,
  useErrorMessage,
  useHide,
} from "./app/hooks";

const App: React.FC = () => {
  const hide = useHide();
  const { show: showCommand } = useCommandMode();
  const { show: showFind } = useFindMode();
  const { show: showError } = useErrorMessage();
  const { show: showInfo } = useInfoMessage();

  React.useEffect(() => {
    const onMessage = async (message: any): Promise<any> => {
      const msg = messages.valueOf(message);
      switch (msg.type) {
        case messages.CONSOLE_SHOW_COMMAND:
          showCommand(msg.command);
          break;
        case messages.CONSOLE_SHOW_FIND:
          showFind();
          break;
        case messages.CONSOLE_SHOW_ERROR:
          showError(msg.text);
          break;
        case messages.CONSOLE_SHOW_INFO:
          showInfo(msg.text);
          break;
        case messages.CONSOLE_HIDE:
          hide();
          break;
      }
    };

    browser.runtime.onMessage.addListener(onMessage);
    const port = browser.runtime.connect(undefined, {
      name: "vimvixen-console",
    });
    port.onMessage.addListener(onMessage);
  }, []);

  return <Console />;
};

export default App;
