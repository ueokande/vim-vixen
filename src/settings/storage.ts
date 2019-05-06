import SettingData, { DefaultSettingData } from '../shared/SettingData';

export const load = async(): Promise<SettingData> => {
  let { settings } = await browser.storage.local.get('settings');
  if (!settings) {
    return DefaultSettingData;
  }
  return SettingData.valueOf(settings as any);
};

export const save = (data: SettingData) => {
  return browser.storage.local.set({
    settings: data.toJSON(),
  });
};
