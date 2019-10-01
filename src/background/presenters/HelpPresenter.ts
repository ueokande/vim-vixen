import { injectable } from 'tsyringe';

const url = 'https://ueokande.github.io/vim-vixen/';

@injectable()
export default class HelpPresenter {
  async open(): Promise<void> {
    await browser.tabs.create({ url, active: true });
  }
}
