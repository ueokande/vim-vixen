import { SettingRepositoryImpl } from '../../../src/content/repositories/SettingRepository';
import { expect } from 'chai';
import Keymaps from '../../../src/shared/settings/Keymaps';
import Search from '../../../src/shared/settings/Search';

describe('SettingRepositoryImpl', () => {
  it('updates and gets current value', () => {
    let sut = new SettingRepositoryImpl();

    let settings = {
      keymaps: Keymaps.fromJSON({}),
      search: Search.fromJSON({
        default: 'google',
        engines: {
          google: 'https://google.com/?q={}',
        }
      }),
      properties: {
        hintchars: 'abcd1234',
        smoothscroll: false,
        complete: 'sbh',
      },
      blacklist: [],
    };

    sut.set(settings);

    let actual = sut.get();
    expect(actual.properties.hintchars).to.equal('abcd1234');
  });
});
