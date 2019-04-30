import TabPresenter from '../presenters/TabPresenter';

const ZOOM_SETTINGS = [
  0.33, 0.50, 0.66, 0.75, 0.80, 0.90, 1.00,
  1.10, 1.25, 1.50, 1.75, 2.00, 2.50, 3.00
];

export default class ZoomUseCase {
  constructor() {
    this.tabPresenter = new TabPresenter();
  }

  async zoomIn(tabId) {
    let tab = await this.tabPresenter.getCurrent();
    let current = await this.tabPresenter.getZoom(tab.id);
    let factor = ZOOM_SETTINGS.find(f => f > current);
    if (factor) {
      return this.tabPresenter.setZoom(tabId, factor);
    }
  }

  async zoomOut(tabId) {
    let tab = await this.tabPresenter.getCurrent();
    let current = await this.tabPresenter.getZoom(tab.id);
    let factor = [].concat(ZOOM_SETTINGS).reverse().find(f => f < current);
    if (factor) {
      return this.tabPresenter.setZoom(tabId, factor);
    }
  }

  zoomNutoral(tabId) {
    return this.tabPresenter.setZoom(tabId, 1);
  }

}
