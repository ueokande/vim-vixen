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
    it.only('opens parent directory of file', async() => {
      var stub = sinon.stub(tabPresenter, 'getCurrent');
      stub.returns(Promise.resolve({ url: 'https://google.com/fruits/yellow/banana' }))

      var mock = sinon.mock(tabPresenter);
      mock.expects('open').withArgs('https://google.com/fruits/yellow/');

      await sut.openParent();

      mock.verify();
    });

    it.only('opens parent directory of directory', async() => {
      var stub = sinon.stub(tabPresenter, 'getCurrent');
      stub.returns(Promise.resolve({ url: 'https://google.com/fruits/yellow/' }))

      var mock = sinon.mock(tabPresenter);
      mock.expects('open').withArgs('https://google.com/fruits/');

      await sut.openParent();

      mock.verify();
    });

    it.only('removes hash', async() => {
      var stub = sinon.stub(tabPresenter, 'getCurrent');
      stub.returns(Promise.resolve({ url: 'https://google.com/#top' }))

      var mock = sinon.mock(tabPresenter);
      mock.expects('open').withArgs('https://google.com/');

      await sut.openParent();

      mock.verify();
    });

    it.only('removes search query', async() => {
      var stub = sinon.stub(tabPresenter, 'getCurrent');
      stub.returns(Promise.resolve({ url: 'https://google.com/search?q=apple' }))

      var mock = sinon.mock(tabPresenter);
      mock.expects('open').withArgs('https://google.com/search');

      await sut.openParent();

      mock.verify();
    });
  });

  describe('#openRoot()', () => {
    it.only('opens root direectory', async() => {
      var stub = sinon.stub(tabPresenter, 'getCurrent');
      stub.returns(Promise.resolve({
        url: 'https://google.com/seach?q=apple',
      }))

      var mock = sinon.mock(tabPresenter);
      mock.expects('open').withArgs('https://google.com');

      await sut.openRoot();

      mock.verify();
    });
  });
});
