import SettingRepository from "../../repositories/SettingRepository";

export default class AbstractScrollOperator {
  constructor(private readonly settingRepository: SettingRepository) {}

  protected getSmoothScroll(): boolean {
    const settings = this.settingRepository.get();
    return settings.properties.smoothscroll;
  }
}
