import { inject, injectable } from "tsyringe";
import TabPresenter from "../presenters/TabPresenter";

const ZOOM_SETTINGS: number[] = [
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
];

@injectable()
export default class ZoomUseCase {
  constructor(@inject("TabPresenter") private tabPresenter: TabPresenter) {}

  async zoomIn(): Promise<any> {
    const tab = await this.tabPresenter.getCurrent();
    const tabId = tab.id as number;
    const current = await this.tabPresenter.getZoom(tabId);
    const factor = ZOOM_SETTINGS.find((f) => f > current);
    if (factor) {
      return this.tabPresenter.setZoom(tabId as number, factor);
    }
  }

  async zoomOut(): Promise<any> {
    const tab = await this.tabPresenter.getCurrent();
    const tabId = tab.id as number;
    const current = await this.tabPresenter.getZoom(tabId);
    const factor = ZOOM_SETTINGS.slice(0)
      .reverse()
      .find((f) => f < current);
    if (factor) {
      return this.tabPresenter.setZoom(tabId as number, factor);
    }
  }

  async zoomNutoral(): Promise<any> {
    const tab = await this.tabPresenter.getCurrent();
    return this.tabPresenter.setZoom(tab.id as number, 1);
  }
}
