import ClipboardRepository from '../../../src/content/repositories/ClipboardRepository';
import { SettingRepositoryImpl } from '../../../src/content/repositories/SettingRepository';
import ClipboardUseCase from '../../../src/content/usecases/ClipboardUseCase';
import OperationClient from '../../../src/content/client/OperationClient';
import ConsoleClient from '../../../src/content/client/ConsoleClient';

import * as sinon from 'sinon';
import { expect } from 'chai';

describe('ClipboardUseCase', () => {
  let clipboardRepository: ClipboardRepository;
  let operationClient: OperationClient;
  let consoleClient: ConsoleClient;
  let sut: ClipboardUseCase;

  beforeEach(() => {
    var modal = <ConsoleClient>{};

    clipboardRepository = <ClipboardRepository>{ read() {}, write(_) {} };
    operationClient = <OperationClient>{ internalOpenUrl(_) {} };
    consoleClient = <ConsoleClient>{ info(_) {}};
    sut = new ClipboardUseCase(
      clipboardRepository,
      new SettingRepositoryImpl(),
      consoleClient,
      operationClient,
   );
  });

  describe('#yankCurrentURL', () => {
    it('yanks current url', async () => {
      let href = window.location.href;
      var mockRepository = sinon.mock(clipboardRepository);
      mockRepository.expects('write').withArgs(href);
      var mockConsoleClient = sinon.mock(consoleClient);
      mockConsoleClient.expects('info').withArgs('Yanked ' + href);

      let yanked = await sut.yankCurrentURL();

      expect(yanked).to.equal(href);
      mockRepository.verify();
      mockConsoleClient.verify();
    });
  });

  describe('#openOrSearch', () => {
    it('opens url from the clipboard', async () => {
      let url = 'https://github.com/ueokande/vim-vixen'
      sinon.stub(clipboardRepository, 'read').returns(url);
      let mockOperationClient = sinon.mock(operationClient);
      mockOperationClient.expects('internalOpenUrl').withArgs(url, true);

      await sut.openOrSearch(true);

      mockOperationClient.verify();
    });

    it('opens search results from the clipboard', async () => {
      let url = 'https://google.com/search?q=banana';
      sinon.stub(clipboardRepository, 'read').returns('banana');
      let mockOperationClient = sinon.mock(operationClient);
      mockOperationClient.expects('internalOpenUrl').withArgs(url, true);

      await sut.openOrSearch(true);

      mockOperationClient.verify();
    });
  });
});
