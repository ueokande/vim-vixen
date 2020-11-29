import Operator from "../Operator";
import TabPresenter from "../../presenters/TabPresenter";

export default class NavigateParentOperator implements Operator {
  constructor(private readonly tabPresenter: TabPresenter) {}

  async run(): Promise<void> {
    const tab = await this.tabPresenter.getCurrent();
    const url = new URL(tab.url!);
    if (url.hash.length > 0) {
      url.hash = "";
    } else if (url.search.length > 0) {
      url.search = "";
    } else {
      const basenamePattern = /\/[^/]+$/;
      const lastDirPattern = /\/[^/]+\/$/;
      if (basenamePattern.test(url.pathname)) {
        url.pathname = url.pathname.replace(basenamePattern, "/");
      } else if (lastDirPattern.test(url.pathname)) {
        url.pathname = url.pathname.replace(lastDirPattern, "/");
      }
    }
    await this.tabPresenter.open(url.href);
  }
}
