import manifest from '../../../manifest.json';
import TabPresenter from '../presenters/TabPresenter';
import NotifyPresenter from '../presenters/NotifyPresenter';

export default class VersionUseCase {
  private tabPresenter: TabPresenter;

  private notifyPresenter: NotifyPresenter;

  constructor() {
    this.tabPresenter = new TabPresenter();
    this.notifyPresenter = new NotifyPresenter();
  }

  notify(): Promise<string> {
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
