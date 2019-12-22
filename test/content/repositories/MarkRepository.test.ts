import { MarkRepositoryImpl } from '../../../src/content/repositories/MarkRepository';
import { expect } from 'chai';

describe('MarkRepositoryImpl', () => {
  it('save and load marks', () => {
    const sut = new MarkRepositoryImpl();

    sut.set('a', { x: 10, y: 20 });
    expect(sut.get('a')).to.deep.equal({ x: 10, y: 20 });
    expect(sut.get('b')).to.be.null;
  });
});

