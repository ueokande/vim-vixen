import React from "react";
import { ColorSchemeUpdateContext } from "./contexts";
import SettingClient from "../clients/SettingClient";

export const useColorSchemeRefresh = () => {
  const update = React.useContext(ColorSchemeUpdateContext);
  const settingClient = new SettingClient();
  const refresh = React.useCallback(() => {
    settingClient.getColorScheme().then((newScheme) => {
      update(newScheme);
    });
  }, []);

  return refresh;
};
