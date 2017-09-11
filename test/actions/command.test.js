import { expect } from "chai";
import actions from '../../src/actions';
import * as commandActions from '../../src/actions/command';

describe("command actions", () => {
  describe("exec", () => {
    context("open command", () => {
      it('create COMMAND_OPEN_URL acion with a full url', () => {
        let action = commandActions.exec("open https://github.com/")
        expect(action.type).to.equal(actions.COMMAND_OPEN_URL);
        expect(action.url).to.equal('https://github.com/');
      });

      it('create COMMAND_OPEN_URL acion with a domain name', () => {
        let action = commandActions.exec("open github.com")
        expect(action.type).to.equal(actions.COMMAND_OPEN_URL);
        expect(action.url).to.equal('http://github.com');
      });
    });

    context("tabopen command", () => {
      it('create COMMAND_TABOPEN_URL acion with a full url', () => {
        let action = commandActions.exec("tabopen https://github.com/")
        expect(action.type).to.equal(actions.COMMAND_TABOPEN_URL);
        expect(action.url).to.equal('https://github.com/');
      });

      it('create COMMAND_TABOPEN_URL acion with a domain name', () => {
        let action = commandActions.exec("tabopen github.com")
        expect(action.type).to.equal(actions.COMMAND_TABOPEN_URL);
        expect(action.url).to.equal('http://github.com');
      });
    });

    context("buffer command", () => {
      it('create COMMAND_BUFFER acion with a keywords', () => {
        let action = commandActions.exec("buffer foo bar")
        expect(action.type).to.equal(actions.COMMAND_BUFFER);
        expect(action.keywords).to.equal('foo bar');
      });
    });

    context("b command", () => {
      it('create COMMAND_BUFFER acion with a keywords', () => {
        let action = commandActions.exec("b foo bar")
        expect(action.type).to.equal(actions.COMMAND_BUFFER);
        expect(action.keywords).to.equal('foo bar');
      });
    });
  });
});
