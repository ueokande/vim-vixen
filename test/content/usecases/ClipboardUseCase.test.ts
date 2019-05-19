import ClipboardRepository from '../../../src/content/repositories/ClipboardRepository';
import TabsClient from '../../../src/content/client/TabsClient';
import MockConsoleClient from '../mock/MockConsoleClient';
import ClipboardUseCase from '../../../src/content/usecases/ClipboardUseCase';
import { expect } from 'chai';

class MockClipboardRepository implements ClipboardRepository {
  public clipboard: string;

  constructor() {
    this.clipboard = '';
  }

  read(): string {
    return this.clipboard;
  }

  write(text: string): void {
    this.clipboard = text;
  }
}

class MockTabsClient implements TabsClient {
  public last: string;

  constructor() {
    this.last = '';
  }

  openUrl(url: string, _newTab: boolean): Promise<void> {
    this.last = url;
    return Promise.resolve();
  }
}

describe('ClipboardUseCase', () => {
  let repository: MockClipboardRepository;
  let client: MockTabsClient;
  let consoleClient: MockConsoleClient;
  let sut: ClipboardUseCase;

  beforeEach(() => {
    repository = new MockClipboardRepository();
    client = new MockTabsClient();
    consoleClient = new MockConsoleClient();
    sut = new ClipboardUseCase({ repository, client: client, consoleClient });
  });

  describe('#yankCurrentURL', () => {
    it('yanks current url', async () => {
      let yanked = await sut.yankCurrentURL();

      expect(yanked).to.equal(window.location.href);
      expect(repository.clipboard).to.equal(yanked);
      expect(consoleClient.text).to.equal('Yanked ' + yanked);
    });
  });

  describe('#openOrSearch', () => {
    it('opens url from the clipboard', async () => {
      let url = 'https://github.com/ueokande/vim-vixen'
      repository.clipboard = url;
      await sut.openOrSearch(true);

      expect(client.last).to.equal(url);
    });

    it('opens search results from the clipboard', async () => {
      repository.clipboard = 'banana';
      await sut.openOrSearch(true);

      expect(client.last).to.equal('https://google.com/search?q=banana');
    });
  });
});

