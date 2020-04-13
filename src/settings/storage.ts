import SettingData, { DefaultSettingData } from "../shared/SettingData";

const loadSettingData = async (): Promise<SettingData> => {
  const { settings: syncSettings } = await browser.storage.sync.get("settings");
  if (syncSettings) {
    return SettingData.fromJSON(syncSettings as any);
  }
  const { settings: localSettings } = await browser.storage.local.get(
    "settings"
  );
  if (localSettings) {
    return SettingData.fromJSON(localSettings as any);
  }
  return DefaultSettingData;
};

export const load = async (): Promise<SettingData> => {
  try {
    return loadSettingData();
  } catch (e) {
    console.error("unable to load settings", e);
    return DefaultSettingData;
  }
};

export const save = async (data: SettingData) => {
  await browser.storage.local.set({
    settings: data.toJSON(),
  });
  return browser.storage.sync.set({
    settings: data.toJSON(),
  });
};
