import TabPresenter from '../presenters/TabPresenter';
import ConsoleClient from '../infrastructures/ConsoleClient';

export default class ConsoleUseCase {
  constructor() {
    this.tabPresenter = new TabPresenter();
    this.consoleClient = new ConsoleClient();
  }

  async showCommand() {
    let tab = await this.tabPresenter.getCurrent();
    return this.consoleClient.showCommand(tab.id, '');
  }

  async showOpenCommand(alter) {
    let tab = await this.tabPresenter.getCurrent();
    let command = 'open ';
    if (alter) {
      command += tab.url;
    }
    return this.consoleClient.showCommand(tab.id, command);
  }

  async showTabopenCommand(alter) {
    let tab = await this.tabPresenter.getCurrent();
    let command = 'tabopen ';
    if (alter) {
      command += tab.url;
    }
    return this.consoleClient.showCommand(tab.id, command);
  }

  async showWinopenCommand(alter) {
    let tab = await this.tabPresenter.getCurrent();
    let command = 'winopen ';
    if (alter) {
      command += tab.url;
    }
    return this.consoleClient.showCommand(tab.id, command);
  }

  async showBufferCommand() {
    let tab = await this.tabPresenter.getCurrent();
    let command = 'buffer ';
    return this.consoleClient.showCommand(tab.id, command);
  }

  async showAddbookmarkCommand(alter) {
    let tab = await this.tabPresenter.getCurrent();
    let command = 'addbookmark ';
    if (alter) {
      command += tab.title;
    }
    return this.consoleClient.showCommand(tab.id, command);
  }

  async hideConsole() {
    let tab = await this.tabPresenter.getCurrent();
    return this.consoleClient.hide(tab.id);
  }
}
