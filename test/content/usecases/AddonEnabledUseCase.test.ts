import AddonEnabledRepository from "../../../src/content/repositories/AddonEnabledRepository";
import AddonEnabledUseCase from "../../../src/content/usecases/AddonEnabledUseCase";
import AddonIndicatorClient from "../../../src/content/client/AddonIndicatorClient";
import MockConsoleFramePresenter from "../operators/impls/MockConsoleFramePresenter";

class MockAddonEnabledRepository implements AddonEnabledRepository {
  private enabled: boolean;

  constructor(init: boolean) {
    this.enabled = init;
  }

  set(on: boolean): void {
    this.enabled = on;
  }

  get(): boolean {
    return this.enabled;
  }
}

class MockAddonIndicatorClient implements AddonIndicatorClient {
  public enabled: boolean;

  constructor(init: boolean) {
    this.enabled = init;
  }

  async setEnabled(enabled: boolean): Promise<void> {
    this.enabled = enabled;
    return;
  }
}

describe("AddonEnabledUseCase", () => {
  let repository: MockAddonEnabledRepository;
  let indicator: MockAddonIndicatorClient;
  let presenter: MockConsoleFramePresenter;
  let sut: AddonEnabledUseCase;

  beforeEach(() => {
    repository = new MockAddonEnabledRepository(false);
    indicator = new MockAddonIndicatorClient(false);
    presenter = new MockConsoleFramePresenter(false);
    sut = new AddonEnabledUseCase(indicator, repository, presenter);
  });

  describe("#enable", () => {
    it("store and indicate as enabled", async () => {
      await sut.enable();

      expect(repository.get()).toBeTruthy;
      expect(indicator.enabled).toBeTruthy;
      expect(presenter.attached).toBeTruthy;
    });
  });

  describe("#disable", () => {
    it("store and indicate as disabled", async () => {
      await sut.disable();

      expect(repository.get()).toBeFalsy;
      expect(indicator.enabled).toBeFalsy;
      expect(presenter.attached).toBeFalsy;
    });
  });

  describe("#toggle", () => {
    it("toggled enabled and disabled", async () => {
      repository.set(true);
      await sut.toggle();

      expect(repository.get()).toBeFalsy;
      expect(indicator.enabled).toBeFalsy;
      expect(presenter.attached).toBeFalsy;

      repository.set(false);

      await sut.toggle();

      expect(repository.get()).toBeTruthy;
      expect(indicator.enabled).toBeTruthy;
      expect(presenter.attached).toBeTruthy;
    });
  });

  describe("#getEnabled", () => {
    it("returns current addon enabled", () => {
      repository.set(true);
      expect(sut.getEnabled()).toBeTruthy;

      repository.set(false);
      expect(sut.getEnabled()).toBeFalsy;
    });
  });
});
