import { expect } from 'chai';
import * as re from 'shared/utils/re';

describe("re util", () => {
  it('matches by pattern', () => {
    let regex = re.fromWildcard('*.example.com/*');
    expect('foo.example.com/bar').to.match(regex);
    expect('foo.example.com').not.to.match(regex);
    expect('example.com/bar').not.to.match(regex);

    regex = re.fromWildcard('example.com/*')
    expect('example.com/foo').to.match(regex);
    expect('example.com/').to.match(regex);

    regex = re.fromWildcard('example.com/*bar')
    expect('example.com/foobar').to.match(regex);
    expect('example.com/bar').to.match(regex);
    expect('example.com/foobarfoo').not.to.match(regex);
  })
});
