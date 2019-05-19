import { injectable } from 'tsyringe';
import TabPresenter from '../presenters/TabPresenter';
import ConsoleClient from '../infrastructures/ConsoleClient';

@injectable()
export default class ConsoleUseCase {

  constructor(
    private tabPresenter: TabPresenter,
    private consoleClient: ConsoleClient,
  ) {
  }

  async showCommand(): Promise<any> {
    let tab = await this.tabPresenter.getCurrent();
    return this.consoleClient.showCommand(tab.id as number, '');
  }

  async showOpenCommand(alter: boolean): Promise<any> {
    let tab = await this.tabPresenter.getCurrent();
    let command = 'open ';
    if (alter) {
      command += tab.url || '';
    }
    return this.consoleClient.showCommand(tab.id as number, command);
  }

  async showTabopenCommand(alter: boolean): Promise<any> {
    let tab = await this.tabPresenter.getCurrent();
    let command = 'tabopen ';
    if (alter) {
      command += tab.url || '';
    }
    return this.consoleClient.showCommand(tab.id as number, command);
  }

  async showWinopenCommand(alter: boolean): Promise<any> {
    let tab = await this.tabPresenter.getCurrent();
    let command = 'winopen ';
    if (alter) {
      command += tab.url || '';
    }
    return this.consoleClient.showCommand(tab.id as number, command);
  }

  async showBufferCommand(): Promise<any> {
    let tab = await this.tabPresenter.getCurrent();
    let command = 'buffer ';
    return this.consoleClient.showCommand(tab.id as number, command);
  }

  async showAddbookmarkCommand(alter: boolean): Promise<any> {
    let tab = await this.tabPresenter.getCurrent();
    let command = 'addbookmark ';
    if (alter) {
      command += tab.title || '';
    }
    return this.consoleClient.showCommand(tab.id as number, command);
  }

  async hideConsole(): Promise<any> {
    let tab = await this.tabPresenter.getCurrent();
    return this.consoleClient.hide(tab.id as number);
  }
}
