import AddonEnabledRepository from "../../../src/content/repositories/AddonEnabledRepository";

export default class MockAddonEnabledRepository
  implements AddonEnabledRepository {
  public enabled: boolean;

  constructor(initialValue = false) {
    this.enabled = initialValue;
  }

  get(): boolean {
    return this.enabled;
  }

  set(on: boolean): void {
    this.enabled = on;
  }
}
