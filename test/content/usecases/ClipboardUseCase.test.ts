import ClipboardRepository from '../../../src/content/repositories/ClipboardRepository';
import { SettingRepositoryImpl } from '../../../src/content/repositories/SettingRepository';
import ClipboardUseCase from '../../../src/content/usecases/ClipboardUseCase';
import OperationClient from '../../../src/content/client/OperationClient';
import ConsoleClient from '../../../src/content/client/ConsoleClient';

import * as sinon from 'sinon';
import { expect } from 'chai';
import {Operation} from "../../../src/shared/operations";

describe('ClipboardUseCase', () => {
  let clipboardRepository: ClipboardRepository;

  let operationClient: OperationClient;

  let consoleClient: ConsoleClient;

  let sut: ClipboardUseCase;

  beforeEach(() => {
    clipboardRepository = new class implements ClipboardRepository {
      read(): string { return ""; }
      write(_text: string) {}
    };
    operationClient = new class implements OperationClient {
      execBackgroundOp(_repeat: number, _op: Operation): Promise<void> { return Promise.resolve() }
      internalOpenUrl(_url: string, _newTab?: boolean, _background?: boolean): Promise<void> { return Promise.resolve() }
    };
    consoleClient = new class implements ConsoleClient {
      error(_text: string): Promise<void> { return Promise.resolve() }
      info(_text: string): Promise<void> { return Promise.resolve() }
    };

    sut = new ClipboardUseCase(
      clipboardRepository,
      new SettingRepositoryImpl(),
      consoleClient,
      operationClient,
   );
  });

  describe('#yankCurrentURL', () => {
    it('yanks current url', async () => {
      const href = window.location.href;
      const mockRepository = sinon.mock(clipboardRepository);
      mockRepository.expects('write').withArgs(href);
      const mockConsoleClient = sinon.mock(consoleClient);
      mockConsoleClient.expects('info').withArgs('Yanked ' + href);

      const yanked = await sut.yankCurrentURL();

      expect(yanked).to.equal(href);
      mockRepository.verify();
      mockConsoleClient.verify();
    });
  });

  describe('#openOrSearch', () => {
    it('opens url from the clipboard', async () => {
      const url = 'https://github.com/ueokande/vim-vixen'
      sinon.stub(clipboardRepository, 'read').returns(url);
      const mockOperationClient = sinon.mock(operationClient);
      mockOperationClient.expects('internalOpenUrl').withArgs(url, true);

      await sut.openOrSearch(true);

      mockOperationClient.verify();
    });

    it('opens search results from the clipboard', async () => {
      const url = 'https://google.com/search?q=banana';
      sinon.stub(clipboardRepository, 'read').returns('banana');
      const mockOperationClient = sinon.mock(operationClient);
      mockOperationClient.expects('internalOpenUrl').withArgs(url, true);

      await sut.openOrSearch(true);

      mockOperationClient.verify();
    });
  });
});
