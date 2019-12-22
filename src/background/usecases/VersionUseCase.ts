import { injectable } from 'tsyringe';
import TabPresenter from '../presenters/TabPresenter';
import NotifyPresenter from '../presenters/NotifyPresenter';

@injectable()
export default class VersionUseCase {
  constructor(
    private tabPresenter: TabPresenter,
    private notifyPresenter: NotifyPresenter,
  ) {
  }

  notify(): Promise<void> {
    const manifest = browser.runtime.getManifest();
    const url = this.releaseNoteUrl(manifest.version);
    return this.notifyPresenter.notifyUpdated(manifest.version, () => {
      this.tabPresenter.create(url);
    });
  }

  releaseNoteUrl(version?: string): string {
    if (version) {
      return `https://github.com/ueokande/vim-vixen/releases/tag/${version}`;
    }
    return 'https://github.com/ueokande/vim-vixen/releases/';
  }
}
