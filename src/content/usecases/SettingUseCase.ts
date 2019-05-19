import SettingRepository, { SettingRepositoryImpl }
  from '../repositories/SettingRepository';
import SettingClient, { SettingClientImpl } from '../client/SettingClient';
import Settings from '../../shared/Settings';

export default class SettingUseCase {
  private repository: SettingRepository;

  private client: SettingClient;

  constructor({
    repository = new SettingRepositoryImpl(),
    client = new SettingClientImpl(),
  } = {}) {
    this.repository = repository;
    this.client = client;
  }

  async reload(): Promise<Settings> {
    let settings = await this.client.load();
    this.repository.set(settings);
    return settings;
  }
}
