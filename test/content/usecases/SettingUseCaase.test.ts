import SettingRepository from "../../../src/content/repositories/SettingRepository";
import SettingClient from "../../../src/content/client/SettingClient";
import SettingUseCase from "../../../src/content/usecases/SettingUseCase";
import Settings, {
  DefaultSetting,
} from "../../../src/shared/settings/Settings";

class MockSettingRepository implements SettingRepository {
  private current: Settings;

  constructor() {
    this.current = DefaultSetting;
  }

  set(settings: Settings): void {
    this.current = settings;
  }

  get(): Settings {
    return this.current;
  }
}

class MockSettingClient implements SettingClient {
  private data: Settings;

  constructor(data: Settings) {
    this.data = data;
  }

  load(): Promise<Settings> {
    return Promise.resolve(this.data);
  }
}

describe("AddonEnabledUseCase", () => {
  let repository: MockSettingRepository;
  let client: MockSettingClient;
  let sut: SettingUseCase;

  beforeEach(() => {
    const testSettings = Settings.fromJSON({
      keymaps: {},
      search: {
        default: "google",
        engines: {
          google: "https://google.com/?q={}",
        },
      },
      properties: {
        hintchars: "abcd1234",
        smoothscroll: false,
        complete: "sbh",
      },
      blacklist: [],
    });

    repository = new MockSettingRepository();
    client = new MockSettingClient(testSettings);
    sut = new SettingUseCase(repository, client);
  });

  describe("#reload", () => {
    it("loads settings and store to repository", async () => {
      const settings = await sut.reload();
      expect(settings.properties.hintchars).toEqual("abcd1234");

      const saved = repository.get();
      expect(saved.properties.hintchars).toEqual("abcd1234");
    });
  });
});
