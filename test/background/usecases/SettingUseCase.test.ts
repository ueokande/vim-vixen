import "reflect-metadata";
import SettingUseCase from "../../../src/background/usecases/SettingUseCase";
import SettingRepository from "../../../src/background/repositories/SettingRepository";
import SettingData, { JSONTextSettings } from "../../../src/shared/SettingData";
import CachedSettingRepository from "../../../src/background/repositories/CachedSettingRepository";
import Settings, {
  DefaultSetting,
} from "../../../src/shared/settings/Settings";
import Notifier from "../../../src/background/presenters/Notifier";
import Properties from "../../../src/shared/settings/Properties";

class MockSettingRepository implements SettingRepository {
  load(): Promise<SettingData | null> {
    throw new Error("not implemented");
  }

  onChange(_: () => void): void {}
}

class MockCachedSettingRepository implements CachedSettingRepository {
  private current: Settings = DefaultSetting;

  get(): Promise<Settings> {
    return Promise.resolve(this.current);
  }

  setProperty(name: string, value: string | number | boolean): Promise<void> {
    (this.current.properties as any)[name] = value;
    return Promise.resolve();
  }

  update(value: Settings): Promise<void> {
    this.current = value;
    return Promise.resolve();
  }
}

class NopNotifier implements Notifier {
  notifyInvalidSettings(_error: Error, _onclick: () => void): Promise<void> {
    return Promise.resolve();
  }

  notifyUpdated(_version: string, _onclick: () => void): Promise<void> {
    return Promise.resolve();
  }
}

describe("SettingUseCase", () => {
  let localSettingRepository: SettingRepository;
  let syncSettingRepository: SettingRepository;
  let cachedSettingRepository: CachedSettingRepository;
  let notifier: Notifier;
  let sut: SettingUseCase;

  beforeEach(() => {
    localSettingRepository = new MockSettingRepository();
    syncSettingRepository = new MockSettingRepository();
    cachedSettingRepository = new MockCachedSettingRepository();
    notifier = new NopNotifier();
    sut = new SettingUseCase(
      localSettingRepository,
      syncSettingRepository,
      cachedSettingRepository,
      notifier
    );
  });

  describe("getCached", () => {
    it("returns cached settings", async () => {
      const settings = new Settings({
        keymaps: DefaultSetting.keymaps,
        search: DefaultSetting.search,
        blacklist: DefaultSetting.blacklist,
        properties: new Properties({
          hintchars: "abcd1234",
        }),
      });
      jest.spyOn(cachedSettingRepository, "get").mockResolvedValue(settings);

      const got = await sut.getCached();
      expect(got.properties.hintchars).toEqual("abcd1234");
    });
  });

  describe("reload", () => {
    describe("when sync is not set", () => {
      it("loads settings from local storage", async () => {
        const settings = new Settings({
          keymaps: DefaultSetting.keymaps,
          search: DefaultSetting.search,
          blacklist: DefaultSetting.blacklist,
          properties: new Properties({
            hintchars: "abcd1234",
          }),
        });
        const settingData = SettingData.fromJSON({
          source: "json",
          json: JSONTextSettings.fromSettings(settings).toJSONText(),
        });

        jest.spyOn(syncSettingRepository, "load").mockResolvedValue(null);
        jest
          .spyOn(localSettingRepository, "load")
          .mockResolvedValue(settingData);

        await sut.reload();

        const current = await cachedSettingRepository.get();
        expect(current.properties.hintchars).toEqual("abcd1234");
      });
    });

    describe("when local is not set", () => {
      it("loads settings from sync storage", async () => {
        const settings = new Settings({
          keymaps: DefaultSetting.keymaps,
          search: DefaultSetting.search,
          blacklist: DefaultSetting.blacklist,
          properties: new Properties({
            hintchars: "aaaa1111",
          }),
        });
        const settingData = SettingData.fromJSON({
          source: "json",
          json: JSONTextSettings.fromSettings(settings).toJSONText(),
        });

        jest
          .spyOn(syncSettingRepository, "load")
          .mockResolvedValue(settingData);
        jest.spyOn(localSettingRepository, "load").mockResolvedValue(null);

        await sut.reload();

        const current = await cachedSettingRepository.get();
        expect(current.properties.hintchars).toEqual("aaaa1111");
      });
    });

    describe("neither local nor sync not set", () => {
      it("loads settings from sync storage", async () => {
        jest.spyOn(syncSettingRepository, "load").mockResolvedValue(null);
        jest.spyOn(localSettingRepository, "load").mockResolvedValue(null);

        await sut.reload();

        const current = await cachedSettingRepository.get();
        expect(current.properties.hintchars).toEqual(
          DefaultSetting.properties.hintchars
        );
      });
    });
  });
});
