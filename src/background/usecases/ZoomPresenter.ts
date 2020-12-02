const ZOOM_SETTINGS = [
  0.33,
  0.5,
  0.66,
  0.75,
  0.8,
  0.9,
  1.0,
  1.1,
  1.25,
  1.5,
  1.75,
  2.0,
  2.5,
  3.0,
] as const;

export default interface ZoomPresenter {
  zoomIn(): Promise<void>;
  zoomOut(): Promise<void>;
  resetZoom(): Promise<void>;
}

export class ZoomPresenterImpl implements ZoomPresenter {
  async zoomIn(): Promise<void> {
    const tab = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    const tabId = tab[0].id as number;
    const current = await browser.tabs.getZoom(tabId);
    const factor = ZOOM_SETTINGS.find((f) => f > current);
    if (factor) {
      return browser.tabs.setZoom(tabId, factor);
    }
  }

  async zoomOut(): Promise<void> {
    const tab = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    const tabId = tab[0].id as number;
    const current = await browser.tabs.getZoom(tabId);
    const factor = ZOOM_SETTINGS.slice(0)
      .reverse()
      .find((f) => f < current);
    if (factor) {
      return browser.tabs.setZoom(tabId, factor);
    }
  }

  async resetZoom(): Promise<void> {
    const tab = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    return browser.tabs.setZoom(tab[0].id, 1);
  }
}
