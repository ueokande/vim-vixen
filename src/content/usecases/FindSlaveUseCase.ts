import { injectable, inject } from 'tsyringe';
import FindMasterClient from '../client/FindMasterClient';

@injectable()
export default class FindSlaveUseCase {
  constructor(
    @inject('FindMasterClient') private findMasterClient: FindMasterClient,
  ) {
  }

  findNext() {
    this.findMasterClient.findNext();
  }

  findPrev() {
    this.findMasterClient.findPrev();
  }
}
