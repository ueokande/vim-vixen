import { injectable, inject } from 'tsyringe';
import AddonIndicatorClient from '../client/AddonIndicatorClient';
import AddonEnabledRepository from '../repositories/AddonEnabledRepository';

@injectable()
export default class AddonEnabledUseCase {

  constructor(
    @inject('AddonIndicatorClient')
    private indicator: AddonIndicatorClient,

    @inject('AddonEnabledRepository')
    private repository: AddonEnabledRepository,
  ) {
  }

  async enable(): Promise<void> {
    await this.setEnabled(true);
  }

  async disable(): Promise<void> {
    await this.setEnabled(false);
  }

  async toggle(): Promise<void> {
    const current = this.repository.get();
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
