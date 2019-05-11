import ConsoleClient from '../../../src/content/client/ConsoleClient';

export default class MockConsoleClient implements ConsoleClient {
  public isError: boolean;

  public text: string;

  constructor() {
    this.isError = false;
    this.text = '';
  }

  info(text: string): Promise<void> {
    this.isError = false;
    this.text = text;
    return Promise.resolve();
  }

  error(text: string): Promise<void> {
    this.isError = true;
    this.text = text;
    return Promise.resolve();
  }
}


