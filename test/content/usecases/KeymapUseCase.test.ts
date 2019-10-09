import KeymapUseCase from '../../../src/content/usecases/KeymapUseCase';
import {expect} from 'chai';
import SettingRepository from "../../../src/content/repositories/SettingRepository";
import Settings from "../../../src/shared/settings/Settings";
import AddonEnabledRepository from "../../../src/content/repositories/AddonEnabledRepository";
import {KeymapRepositoryImpl} from "../../../src/content/repositories/KeymapRepository";
import Key from "../../../src/shared/settings/Key";
import AddressRepository from "../../../src/content/repositories/AddressRepository";

class MockSettingRepository implements SettingRepository {
  constructor(
    private readonly settings: Settings,
  ) {
  }

  get(): Settings {
    return this.settings;
  }

  set(_setting: Settings): void {
    throw new Error('TODO');
  }
}

class MockAddonEnabledRepository implements AddonEnabledRepository {
  constructor(
    private readonly enabled: boolean,
  ) {
  }

  get(): boolean {
    return this.enabled;
  }

  set(_on: boolean): void {
    throw new Error('TODO');
  }
}

class MockAddressRepository implements AddressRepository {
  constructor(
    private url: URL,
  ) {
  }

  getCurrentURL(): URL {
    return this.url;
  }
}


describe('KeymapUseCase', () => {
  it('returns matched operation', () => {
    let settings = Settings.fromJSON({
      keymaps: {
        k: {type: 'scroll.vertically', count: -1},
        j: {type: 'scroll.vertically', count: 1},
        gg: {type: 'scroll.top'},
      },
    });
    let sut = new KeymapUseCase(
      new KeymapRepositoryImpl(),
      new MockSettingRepository(settings),
      new MockAddonEnabledRepository(true),
      new MockAddressRepository(new URL('https://example.com')),
    );

    expect(sut.nextOp(Key.fromMapKey('k'))).to.deep.equal({type: 'scroll.vertically', count: -1});
    expect(sut.nextOp(Key.fromMapKey('j'))).to.deep.equal({type: 'scroll.vertically', count: 1});
    expect(sut.nextOp(Key.fromMapKey('g'))).to.be.null;
    expect(sut.nextOp(Key.fromMapKey('g'))).to.deep.equal({type: 'scroll.top'});
    expect(sut.nextOp(Key.fromMapKey('z'))).to.be.null;
  });

  it('returns only ADDON_ENABLE and ADDON_TOGGLE_ENABLED operation', () => {
    let settings = Settings.fromJSON({
      keymaps: {
        k: {type: 'scroll.vertically', count: -1},
        a: {type: 'addon.enable'},
        b: {type: 'addon.toggle.enabled'},
      },
    });
    let sut = new KeymapUseCase(
      new KeymapRepositoryImpl(),
      new MockSettingRepository(settings),
      new MockAddonEnabledRepository(false),
      new MockAddressRepository(new URL('https://example.com')),
    );

    expect(sut.nextOp(Key.fromMapKey('k'))).to.be.null;
    expect(sut.nextOp(Key.fromMapKey('a'))).to.deep.equal({type: 'addon.enable'});
    expect(sut.nextOp(Key.fromMapKey('b'))).to.deep.equal({type: 'addon.toggle.enabled'});
  });

  it('blocks keys in the partial blacklist', () => {
    let settings = Settings.fromJSON({
      keymaps: {
        k: {type: 'scroll.vertically', count: -1},
        j: {type: 'scroll.vertically', count: 1},
        gg: {"type": "scroll.top"},
        G: {"type": "scroll.bottom"},
      },
      blacklist: [
        { url: "example.com", keys: ['g'] },
        { url: "example.org", keys: ['<S-G>'] }
      ],
    });

    let sut = new KeymapUseCase(
      new KeymapRepositoryImpl(),
      new MockSettingRepository(settings),
      new MockAddonEnabledRepository(true),
      new MockAddressRepository(new URL('https://example.com')),
    );

    expect(sut.nextOp(Key.fromMapKey('k'))).to.deep.equal({type: 'scroll.vertically', count: -1});
    expect(sut.nextOp(Key.fromMapKey('j'))).to.deep.equal({type: 'scroll.vertically', count: 1});
    expect(sut.nextOp(Key.fromMapKey('g'))).to.be.null;
    expect(sut.nextOp(Key.fromMapKey('g'))).to.be.null;
    expect(sut.nextOp(Key.fromMapKey('G'))).to.deep.equal({type: 'scroll.bottom'});

    sut = new KeymapUseCase(
      new KeymapRepositoryImpl(),
      new MockSettingRepository(settings),
      new MockAddonEnabledRepository(true),
      new MockAddressRepository(new URL('https://example.org')),
    );

    expect(sut.nextOp(Key.fromMapKey('g'))).to.be.null;
    expect(sut.nextOp(Key.fromMapKey('g'))).to.deep.equal({type: 'scroll.top'});
    expect(sut.nextOp(Key.fromMapKey('G'))).to.be.null;
  });
});
