import { expect } from "chai";
import * as messages from '../../src/shared/messages';

describe('messages', () => {
  describe('#receive', () => {
    it('received a message', (done) => {
      messages.receive(window, (message) => {
        expect(message).to.deep.equal({ type: 'vimvixen.test' });
        done();
      });
      window.postMessage(JSON.stringify({ type: 'vimvixen.test' }), '*');
    });
  });

  describe('#send', () => {
    it('sends a message', (done) => {
      window.addEventListener('message', (e) => {
        let json = JSON.parse(e.data);
        expect(json).to.deep.equal({ type: 'vimvixen.test' });
        done();
      });
      messages.send(window, { type: 'vimvixen.test' });
    });
  });
});
