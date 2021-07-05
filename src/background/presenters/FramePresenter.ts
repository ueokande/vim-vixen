export default interface FramePresenter {
  getAllFrameIds(tabId: number): Promise<Array<number>>;
}

export class FramePresenterImpl implements FramePresenter {
  async getAllFrameIds(tabId: number): Promise<Array<number>> {
    const frames = await browser.webNavigation.getAllFrames({ tabId: tabId });
    return frames
      .filter((f) => !f.url.startsWith("moz-extension://"))
      .map((f) => f.frameId);
  }
}
