import * as messages from '../../shared/messages';

export default interface FindMasterClient {
  findNext(): void;

  findPrev(): void;

  // eslint-disable-next-line semi
}

export class FindMasterClientImpl implements FindMasterClient {
  findNext(): void {
    window.top.postMessage(JSON.stringify({
      type: messages.FIND_NEXT,
    }), '*');
  }

  findPrev(): void {
    window.top.postMessage(JSON.stringify({
      type: messages.FIND_PREV,
    }), '*');
  }
}
