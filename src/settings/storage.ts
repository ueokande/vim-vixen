import SettingData, { DefaultSettingData } from '../shared/SettingData';

export const load = async(): Promise<SettingData> => {
  let { settings } = await browser.storage.local.get('settings');
  if (!settings) {
    return DefaultSettingData;
  }
  try {
    return SettingData.valueOf(settings as any);
  } catch (e) {
    console.error('unable to load settings', e);
    return DefaultSettingData;
  }
};

export const save = (data: SettingData) => {
  return browser.storage.local.set({
    settings: data.toJSON(),
  });
};
