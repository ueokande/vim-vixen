import manifest from '../../../manifest.json';
import VersionRepository from '../repositories/version';
import TabPresenter from '../presenters/tab';
import Notifier from '../infrastructures/notifier';

export default class VersionInteractor {
  constructor() {
    this.versionRepository = new VersionRepository();
    this.tabPresenter = new TabPresenter();
    this.notifier = new Notifier();
  }

  async notifyIfUpdated() {
    if (!await this.checkUpdated()) {
      return;
    }

    let title = 'Vim Vixen ' + manifest.version + ' has been installed';
    let message = 'Click here to see release notes';
    this.notifier.notify(title, message, () => {
      let url = this.releaseNoteUrl(manifest.version);
      this.tabPresenter.create(url);
    });
    this.versionRepository.update(manifest.version);
  }

  async checkUpdated() {
    let prev = await this.versionRepository.get();
    if (!prev) {
      return true;
    }
    return manifest.version !== prev;
  }

  releaseNoteUrl(version) {
    if (version) {
      return 'https://github.com/ueokande/vim-vixen/releases/tag/' + version;
    }
    return 'https://github.com/ueokande/vim-vixen/releases/';
  }
}
