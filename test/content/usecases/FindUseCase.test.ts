import FindRepository from '../../../src/content/repositories/FindRepository';
import FindPresenter from '../../../src/content/presenters/FindPresenter';
import FindClient from '../../../src/content/client/FindClient';
import FindUseCase from '../../../src/content/usecases/FindUseCase';
import MockConsoleClient from '../mock/MockConsoleClient';
import { expect } from 'chai';

class MockFindRepository implements FindRepository {
  public keyword: string | null;

  constructor() {
    this.keyword = null;
  }

  getLastKeyword(): string | null {
    return this.keyword;
  }

  setLastKeyword(keyword: string): void {
    this.keyword = keyword;
  }
}

class MockFindPresenter implements FindPresenter {
  public document: string;

  public highlighted: boolean;

  constructor() {
    this.document = '';
    this.highlighted = false;
  }

  find(keyword: string, _backward: boolean): boolean {
    let found = this.document.includes(keyword);
    this.highlighted = found;
    return found;
  }

  clearSelection(): void {
    this.highlighted = false;
  }
}

class MockFindClient implements FindClient {
  public keyword: string | null;

  constructor() {
    this.keyword = null;
  }

  getGlobalLastKeyword(): Promise<string | null> {
    return Promise.resolve(this.keyword);
  }

  setGlobalLastKeyword(keyword: string): Promise<void> {
    this.keyword = keyword;
    return Promise.resolve();
  }
}

describe('FindUseCase', () => {
  let repository: MockFindRepository;
  let presenter: MockFindPresenter;
  let client: MockFindClient;
  let consoleClient: MockConsoleClient;
  let sut: FindUseCase;

  beforeEach(() => {
    repository = new MockFindRepository();
    presenter = new MockFindPresenter();
    client = new MockFindClient();
    consoleClient = new MockConsoleClient();
    sut = new FindUseCase(presenter, repository, client, consoleClient);
  });

  describe('#startFind', () => {
    it('find next by ketword', async() => {
      presenter.document = 'monkey punch';

      await sut.startFind('monkey');

      expect(await presenter.highlighted).to.be.true;
      expect(await consoleClient.text).to.equal('Pattern found: monkey');
      expect(await repository.getLastKeyword()).to.equal('monkey');
      expect(await client.getGlobalLastKeyword()).to.equal('monkey');
    });

    it('find next by last keyword', async() => {
      presenter.document = 'gorilla kick';
      repository.keyword = 'gorilla';

      await sut.startFind(undefined);

      expect(await presenter.highlighted).to.be.true;
      expect(await consoleClient.text).to.equal('Pattern found: gorilla');
      expect(await repository.getLastKeyword()).to.equal('gorilla');
      expect(await client.getGlobalLastKeyword()).to.equal('gorilla');
    });

    it('find next by global last keyword', async() => {
      presenter.document = 'chimpanzee typing';

      repository.keyword = null;
      client.keyword = 'chimpanzee';

      await sut.startFind(undefined);

      expect(await presenter.highlighted).to.be.true;
      expect(await consoleClient.text).to.equal('Pattern found: chimpanzee');
      expect(await repository.getLastKeyword()).to.equal('chimpanzee');
      expect(await client.getGlobalLastKeyword()).to.equal('chimpanzee');
    });

    it('find not found error', async() => {
      presenter.document = 'zoo';

      await sut.startFind('giraffe');

      expect(await presenter.highlighted).to.be.false;
      expect(await consoleClient.text).to.equal('Pattern not found: giraffe');
      expect(await repository.getLastKeyword()).to.equal('giraffe');
      expect(await client.getGlobalLastKeyword()).to.equal('giraffe');
    });

    it('show errors when no last keywords', async() => {
      repository.keyword = null;
      client.keyword = null;

      await sut.startFind(undefined);

      expect(await consoleClient.text).to.equal('No previous search keywords');
      expect(await consoleClient.isError).to.be.true;
    });
  });

  describe('#findNext', () => {
    it('finds by last keyword', async() => {
      presenter.document = 'monkey punch';
      repository.keyword = 'monkey';

      await sut.findNext();

      expect(await presenter.highlighted).to.be.true;
      expect(await consoleClient.text).to.equal('Pattern found: monkey');
    });

    it('show errors when no last keywords', async() => {
      repository.keyword = null;
      client.keyword = null;

      await sut.findNext();

      expect(await consoleClient.text).to.equal('No previous search keywords');
      expect(await consoleClient.isError).to.be.true;
    });
  });

  describe('#findPrev', () => {
  });
});
