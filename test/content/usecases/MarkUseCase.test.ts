import MarkRepository from '../../../src/content/repositories/MarkRepository';
import { SettingRepositoryImpl } from '../../../src/content/repositories/SettingRepository';
import MarkUseCase from '../../../src/content/usecases/MarkUseCase';
import MarkClient from '../../../src/content/client/MarkClient';
import MockConsoleClient from '../mock/MockConsoleClient';
import MockScrollPresenter from '../mock/MockScrollPresenter';
import Mark from '../../../src/content/domains/Mark';
import { expect } from 'chai';

class MockMarkRepository implements MarkRepository {
  private current: {[key: string]: Mark};

  constructor() {
    this.current = {};
  }

  set(key: string, mark: Mark): void {
    this.current[key] = mark;
  }

  get(key: string): Mark | null {
    return this.current[key];
  }
}

class MockMarkClient implements MarkClient {
  public marks: {[key: string]: Mark};
  public last: string;

  constructor() {
    this.marks = {};
    this.last = '';
  }

  setGloablMark(key: string, mark: Mark): Promise<void> {
    this.marks[key] = mark;
    return Promise.resolve();
  }

  jumpGlobalMark(key: string): Promise<void> {
    this.last = key
    return Promise.resolve();
  }
}

describe('MarkUseCase', () => {
  let repository: MockMarkRepository;
  let client: MockMarkClient;
  let consoleClient: MockConsoleClient;
  let scrollPresenter: MockScrollPresenter;
  let sut: MarkUseCase;

  beforeEach(() => {
    repository = new MockMarkRepository();
    client = new MockMarkClient();
    consoleClient = new MockConsoleClient();
    scrollPresenter = new MockScrollPresenter();
    sut = new MarkUseCase(
      scrollPresenter,
      client,
      repository,
      new SettingRepositoryImpl(),
      consoleClient,
    );
  });

  describe('#set', () => {
    it('sets local mark', async() => {
      scrollPresenter.scrollTo(10, 20, false);

      await sut.set('x');

      expect(repository.get('x')).to.deep.equals({ x: 10, y: 20 });
      expect(consoleClient.text).to.equal("Set local mark to 'x'");
    });

    it('sets global mark', async() => {
      scrollPresenter.scrollTo(30, 40, false);

      await sut.set('Z');

      expect(client.marks['Z']).to.deep.equals({ x: 30, y: 40 });
      expect(consoleClient.text).to.equal("Set global mark to 'Z'");
    });
  });

  describe('#jump', () => {
    it('jumps to local mark', async() => {
      repository.set('x', { x: 20, y: 40 });

      await sut.jump('x');

      expect(scrollPresenter.getScroll()).to.deep.equals({ x: 20, y: 40 });
    });

    it('throws an error when no local marks', () => {
      return sut.jump('a').then(() => {
        throw new Error('error');
      }).catch((e) => {
        expect(e).to.be.instanceof(Error);
      })
    })

    it('jumps to global mark', async() => {
      client.marks['Z'] = { x: 20, y: 0 };

      await sut.jump('Z');

      expect(client.last).to.equal('Z')
    });
  });
});
