import TabPresenter from '../../../src/background/presenters/TabPresenter';
import NavigateUseCase from '../../../src/background/usecases/NavigateUseCase';
import NavigateClient from '../../../src/background/clients/NavigateClient';
// import { expect } from 'chai';
import * as sinon from 'sinon';

describe('NavigateUseCase', () => {
  let sut: NavigateUseCase;
  let tabPresenter: TabPresenter;
  let navigateClient: NavigateClient;
  beforeEach(() => {
    tabPresenter = new TabPresenter();
    navigateClient = new NavigateClient();
    sut = new NavigateUseCase(tabPresenter, navigateClient);
  });

  describe('#openParent()', async () => {
    it('opens parent directory of file', async() => {
      const stub = sinon.stub(tabPresenter, 'getCurrent');
      stub.returns(Promise.resolve({ url: 'https://google.com/fruits/yellow/banana' }))

      const mock = sinon.mock(tabPresenter);
      mock.expects('open').withArgs('https://google.com/fruits/yellow/');

      await sut.openParent();

      mock.verify();
    });

    it('opens parent directory of directory', async() => {
      const stub = sinon.stub(tabPresenter, 'getCurrent');
      stub.returns(Promise.resolve({ url: 'https://google.com/fruits/yellow/' }))

      const mock = sinon.mock(tabPresenter);
      mock.expects('open').withArgs('https://google.com/fruits/');

      await sut.openParent();

      mock.verify();
    });

    it('removes hash', async() => {
      const stub = sinon.stub(tabPresenter, 'getCurrent');
      stub.returns(Promise.resolve({ url: 'https://google.com/#top' }))

      const mock = sinon.mock(tabPresenter);
      mock.expects('open').withArgs('https://google.com/');

      await sut.openParent();

      mock.verify();
    });

    it('removes search query', async() => {
      const stub = sinon.stub(tabPresenter, 'getCurrent');
      stub.returns(Promise.resolve({ url: 'https://google.com/search?q=apple' }))

      const mock = sinon.mock(tabPresenter);
      mock.expects('open').withArgs('https://google.com/search');

      await sut.openParent();

      mock.verify();
    });
  });

  describe('#openRoot()', () => {
    it('opens root direectory', async() => {
      const stub = sinon.stub(tabPresenter, 'getCurrent');
      stub.returns(Promise.resolve({
        url: 'https://google.com/seach?q=apple',
      }))

      const mock = sinon.mock(tabPresenter);
      mock.expects('open').withArgs('https://google.com');

      await sut.openRoot();

      mock.verify();
    });
  });
});
