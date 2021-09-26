import "reflect-metadata";
import KeymapUseCase from "../../../src/content/usecases/KeymapUseCase";
import { expect } from "chai";
import SettingRepository from "../../../src/content/repositories/SettingRepository";
import Settings from "../../../src/shared/settings/Settings";
import AddonEnabledRepository from "../../../src/content/repositories/AddonEnabledRepository";
import { KeymapRepositoryImpl } from "../../../src/content/repositories/KeymapRepository";
import Key from "../../../src/shared/settings/Key";
import AddressRepository from "../../../src/content/repositories/AddressRepository";

class MockSettingRepository implements SettingRepository {
  constructor(private readonly settings: Settings) {}

  get(): Settings {
    return this.settings;
  }

  set(_setting: Settings): void {
    throw new Error("TODO");
  }
}

class MockAddonEnabledRepository implements AddonEnabledRepository {
  constructor(private readonly enabled: boolean) {}

  get(): boolean {
    return this.enabled;
  }

  set(_on: boolean): void {
    throw new Error("TODO");
  }
}

class MockAddressRepository implements AddressRepository {
  constructor(private url: URL) {}

  getCurrentURL(): URL {
    return this.url;
  }
}

describe("KeymapUseCase", () => {
  describe("with no-digis keymaps", () => {
    const settings = Settings.fromJSON({
      keymaps: {
        k: { type: "scroll.vertically", count: -1 },
        j: { type: "scroll.vertically", count: 1 },
        gg: { type: "scroll.top" },
      },
    });

    let sut: KeymapUseCase;

    beforeEach(() => {
      sut = new KeymapUseCase(
        new KeymapRepositoryImpl(),
        new MockSettingRepository(settings),
        new MockAddonEnabledRepository(true),
        new MockAddressRepository(new URL("https://example.com"))
      );
    });

    it("returns matched operation", () => {
      expect(sut.nextOps(Key.fromMapKey("k"))).to.deep.equal({
        repeat: 1,
        op: { type: "scroll.vertically", count: -1 },
      });
      expect(sut.nextOps(Key.fromMapKey("j"))).to.deep.equal({
        repeat: 1,
        op: { type: "scroll.vertically", count: 1 },
      });
      expect(sut.nextOps(Key.fromMapKey("g"))).to.be.null;
      expect(sut.nextOps(Key.fromMapKey("g"))).to.deep.equal({
        repeat: 1,
        op: { type: "scroll.top" },
      });
      expect(sut.nextOps(Key.fromMapKey("z"))).to.be.null;
    });

    it("repeats n-times by numeric prefix and multiple key operations", () => {
      expect(sut.nextOps(Key.fromMapKey("1"))).to.be.null;
      expect(sut.nextOps(Key.fromMapKey("0"))).to.be.null;
      expect(sut.nextOps(Key.fromMapKey("g"))).to.be.null;
      expect(sut.nextOps(Key.fromMapKey("g"))).to.deep.equal({
        repeat: 10,
        op: { type: "scroll.top" },
      });
    });
  });

  describe("when keymaps containing numeric mappings", () => {
    const settings = Settings.fromJSON({
      keymaps: {
        20: { type: "scroll.top" },
        g5: { type: "scroll.bottom" },
      },
    });

    let sut: KeymapUseCase;

    beforeEach(() => {
      sut = new KeymapUseCase(
        new KeymapRepositoryImpl(),
        new MockSettingRepository(settings),
        new MockAddonEnabledRepository(true),
        new MockAddressRepository(new URL("https://example.com"))
      );
    });

    it("returns the matched operation ends with digit", () => {
      expect(sut.nextOps(Key.fromMapKey("g"))).to.be.null;
      expect(sut.nextOps(Key.fromMapKey("5"))).to.be.deep.equal({
        repeat: 1,
        op: { type: "scroll.bottom" },
      });
    });

    it("returns an operation matched the operation with digit keymaps", () => {
      expect(sut.nextOps(Key.fromMapKey("2"))).to.be.null;
      expect(sut.nextOps(Key.fromMapKey("0"))).to.be.deep.equal({
        repeat: 1,
        op: { type: "scroll.top" },
      });
    });

    it("returns operations repeated by numeric prefix", () => {
      expect(sut.nextOps(Key.fromMapKey("2"))).to.be.null;
      expect(sut.nextOps(Key.fromMapKey("g"))).to.be.null;
      expect(sut.nextOps(Key.fromMapKey("5"))).to.be.deep.equal({
        repeat: 2,
        op: { type: "scroll.bottom" },
      });
    });

    it("does not matches with digit operation with numeric prefix", () => {
      expect(sut.nextOps(Key.fromMapKey("3"))).to.be.null;
      expect(sut.nextOps(Key.fromMapKey("2"))).to.be.null;
      expect(sut.nextOps(Key.fromMapKey("0"))).to.be.null;
      expect(sut.nextOps(Key.fromMapKey("g"))).to.be.null;
      expect(sut.nextOps(Key.fromMapKey("5"))).to.be.deep.equal({
        repeat: 320,
        op: { type: "scroll.bottom" },
      });
    });
  });

  describe("when the keys are mismatched with the operations", () => {
    const settings = Settings.fromJSON({
      keymaps: {
        gg: { type: "scroll.top" },
        G: { type: "scroll.bottom" },
      },
    });

    let sut: KeymapUseCase;

    beforeEach(() => {
      sut = new KeymapUseCase(
        new KeymapRepositoryImpl(),
        new MockSettingRepository(settings),
        new MockAddonEnabledRepository(true),
        new MockAddressRepository(new URL("https://example.com"))
      );
    });

    it("clears input keys with no-matched operations", () => {
      expect(sut.nextOps(Key.fromMapKey("g"))).to.be.null;
      expect(sut.nextOps(Key.fromMapKey("x"))).to.be.null; // clear
      expect(sut.nextOps(Key.fromMapKey("g"))).to.be.null;
      expect(sut.nextOps(Key.fromMapKey("g"))).to.deep.equal({
        repeat: 1,
        op: { type: "scroll.top" },
      });
    });

    it("clears input keys and the prefix with no-matched operations", () => {
      expect(sut.nextOps(Key.fromMapKey("1"))).to.be.null;
      expect(sut.nextOps(Key.fromMapKey("0"))).to.be.null;
      expect(sut.nextOps(Key.fromMapKey("g"))).to.be.null;
      expect(sut.nextOps(Key.fromMapKey("x"))).to.be.null; // clear
      expect(sut.nextOps(Key.fromMapKey("1"))).to.be.null;
      expect(sut.nextOps(Key.fromMapKey("0"))).to.be.null;
      expect(sut.nextOps(Key.fromMapKey("g"))).to.be.null;
      expect(sut.nextOps(Key.fromMapKey("g"))).to.deep.equal({
        repeat: 10,
        op: { type: "scroll.top" },
      });
    });
  });

  describe("when the site matches to the blacklist", () => {
    const settings = Settings.fromJSON({
      keymaps: {
        k: { type: "scroll.vertically", count: -1 },
        a: { type: "addon.enable" },
        b: { type: "addon.toggle.enabled" },
      },
    });

    let sut: KeymapUseCase;

    beforeEach(() => {
      sut = new KeymapUseCase(
        new KeymapRepositoryImpl(),
        new MockSettingRepository(settings),
        new MockAddonEnabledRepository(false),
        new MockAddressRepository(new URL("https://example.com"))
      );
    });

    it("returns only ADDON_ENABLE and ADDON_TOGGLE_ENABLED operation", () => {
      expect(sut.nextOps(Key.fromMapKey("k"))).to.be.null;
      expect(sut.nextOps(Key.fromMapKey("a"))).to.deep.equal({
        repeat: 1,
        op: { type: "addon.enable" },
      });
      expect(sut.nextOps(Key.fromMapKey("b"))).to.deep.equal({
        repeat: 1,
        op: { type: "addon.toggle.enabled" },
      });
    });
  });

  describe("when the site matches to the partial blacklist", () => {
    const settings = Settings.fromJSON({
      keymaps: {
        k: { type: "scroll.vertically", count: -1 },
        j: { type: "scroll.vertically", count: 1 },
        gg: { type: "scroll.top" },
        G: { type: "scroll.bottom" },
      },
      blacklist: [
        { url: "example.com", keys: ["g"] },
        { url: "example.org", keys: ["<S-G>"] },
      ],
    });

    it("blocks keys in the partial blacklist", () => {
      let sut = new KeymapUseCase(
        new KeymapRepositoryImpl(),
        new MockSettingRepository(settings),
        new MockAddonEnabledRepository(true),
        new MockAddressRepository(new URL("https://example.com"))
      );

      expect(sut.nextOps(Key.fromMapKey("k"))).to.deep.equal({
        repeat: 1,
        op: { type: "scroll.vertically", count: -1 },
      });
      expect(sut.nextOps(Key.fromMapKey("j"))).to.deep.equal({
        repeat: 1,
        op: { type: "scroll.vertically", count: 1 },
      });
      expect(sut.nextOps(Key.fromMapKey("g"))).to.be.null;
      expect(sut.nextOps(Key.fromMapKey("g"))).to.be.null;
      expect(sut.nextOps(Key.fromMapKey("G"))).to.deep.equal({
        repeat: 1,
        op: { type: "scroll.bottom" },
      });

      sut = new KeymapUseCase(
        new KeymapRepositoryImpl(),
        new MockSettingRepository(settings),
        new MockAddonEnabledRepository(true),
        new MockAddressRepository(new URL("https://example.org"))
      );

      expect(sut.nextOps(Key.fromMapKey("g"))).to.be.null;
      expect(sut.nextOps(Key.fromMapKey("g"))).to.deep.equal({
        repeat: 1,
        op: { type: "scroll.top" },
      });
      expect(sut.nextOps(Key.fromMapKey("G"))).to.be.null;
    });
  });
});
