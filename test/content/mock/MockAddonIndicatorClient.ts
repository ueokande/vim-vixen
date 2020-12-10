import AddonIndicatorClient from "../../../src/content/client/AddonIndicatorClient";

export default class MockAddonIndicatorClient implements AddonIndicatorClient {
  public enabled: boolean;

  constructor(initialValue = false) {
    this.enabled = initialValue;
  }

  async setEnabled(enabled: boolean): Promise<void> {
    this.enabled = enabled;
  }
}
