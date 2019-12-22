import { AddonEnabledRepositoryImpl } from '../../../src/content/repositories/AddonEnabledRepository';
import { expect } from 'chai';

describe('AddonEnabledRepositoryImpl', () => {
  it('updates and gets current value', () => {
    const sut = new AddonEnabledRepositoryImpl();

    sut.set(true);
    expect(sut.get()).to.be.true;

    sut.set(false);
    expect(sut.get()).to.be.false;
  });
});

