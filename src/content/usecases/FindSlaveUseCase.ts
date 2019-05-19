import FindMasterClient, { FindMasterClientImpl }
  from '../client/FindMasterClient';

export default class FindSlaveUseCase {
  private findMasterClient: FindMasterClient;

  constructor({
    findMasterClient = new FindMasterClientImpl(),
  } = {}) {
    this.findMasterClient = findMasterClient;
  }

  findNext() {
    this.findMasterClient.findNext();
  }

  findPrev() {
    this.findMasterClient.findPrev();
  }
}
