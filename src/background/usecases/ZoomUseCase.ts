import TabPresenter from '../presenters/TabPresenter';

const ZOOM_SETTINGS: number[] = [
  0.33, 0.50, 0.66, 0.75, 0.80, 0.90, 1.00,
  1.10, 1.25, 1.50, 1.75, 2.00, 2.50, 3.00
];

export default class ZoomUseCase {
  private tabPresenter: TabPresenter;

  constructor() {
    this.tabPresenter = new TabPresenter();
  }

  async zoomIn(): Promise<any> {
    let tab = await this.tabPresenter.getCurrent();
    let tabId = tab.id as number;
    let current = await this.tabPresenter.getZoom(tabId);
    let factor = ZOOM_SETTINGS.find(f => f > current);
    if (factor) {
      return this.tabPresenter.setZoom(tabId as number, factor);
    }
  }

  async zoomOut(): Promise<any> {
    let tab = await this.tabPresenter.getCurrent();
    let tabId = tab.id as number;
    let current = await this.tabPresenter.getZoom(tabId);
    let factor = ZOOM_SETTINGS.slice(0).reverse().find(f => f < current);
    if (factor) {
      return this.tabPresenter.setZoom(tabId as number, factor);
    }
  }

  async zoomNutoral(): Promise<any> {
    let tab = await this.tabPresenter.getCurrent();
    return this.tabPresenter.setZoom(tab.id as number, 1);
  }
}
