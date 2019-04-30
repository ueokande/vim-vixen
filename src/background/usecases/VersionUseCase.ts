import manifest from '../../../manifest.json';
import TabPresenter from '../presenters/TabPresenter';
import NotifyPresenter from '../presenters/NotifyPresenter';

export default class VersionUseCase {
  constructor() {
    this.tabPresenter = new TabPresenter();
    this.notifyPresenter = new NotifyPresenter();
  }

  notify() {
    let title = `Vim Vixen ${manifest.version} has been installed`;
    let message = 'Click here to see release notes';
    let url = this.releaseNoteUrl(manifest.version);
    this.notifyPresenter.notify(title, message, () => {
      this.tabPresenter.create(url);
    });
  }

  releaseNoteUrl(version) {
    if (version) {
      return `https://github.com/ueokande/vim-vixen/releases/tag/${version}`;
    }
    return 'https://github.com/ueokande/vim-vixen/releases/';
  }
}
