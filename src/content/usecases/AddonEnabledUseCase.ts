import AddonIndicatorClient, { AddonIndicatorClientImpl }
  from '../client/AddonIndicatorClient';
import AddonEnabledRepository, { AddonEnabledRepositoryImpl }
  from '../repositories/AddonEnabledRepository';

export default class AddonEnabledUseCase {
  private indicator: AddonIndicatorClient;

  private repository: AddonEnabledRepository;

  constructor({
    indicator = new AddonIndicatorClientImpl(),
    repository = new AddonEnabledRepositoryImpl(),
  } = {}) {
    this.indicator = indicator;
    this.repository = repository;
  }

  async enable(): Promise<void> {
    await this.setEnabled(true);
  }

  async disable(): Promise<void> {
    await this.setEnabled(false);
  }

  async toggle(): Promise<void> {
    let current = this.repository.get();
    await this.setEnabled(!current);
  }

  getEnabled(): boolean {
    return this.repository.get();
  }

  private async setEnabled(on: boolean): Promise<void> {
    this.repository.set(on);
    await this.indicator.setEnabled(on);
  }
}
