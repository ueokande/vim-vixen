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
    let manifest = browser.runtime.getManifest();
    let title = `Vim Vixen ${manifest.version} has been installed`;
    let message = 'Click here to see release notes';
    let url = this.releaseNoteUrl(manifest.version);
    return this.notifyPresenter.notify(title, message, () => {
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
