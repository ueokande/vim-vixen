import { inject, injectable } from "tsyringe";
import Operator from "../Operator";
import OperatorFactoryChain from "../OperatorFactoryChain";
import NavigateHistoryPrevOperator from "./NavigateHistoryPrevOperator";
import NavigateHistoryNextOperator from "./NavigateHistoryNextOperator";
import NavigateLinkPrevOperator from "./NavigateLinkPrevOperator";
import NavigateLinkNextOperator from "./NavigateLinkNextOperator";
import NavigateParentOperator from "./NavigateParentOperator";
import NavigateRootOperator from "./NavigateRootOperator";
import OpenSourceOperator from "./OpenSourceOperator";
import OpenHomeOperator from "./OpenHomeOperator";
import TabPresenter from "../../presenters/TabPresenter";
import NavigateClient from "../../clients/NavigateClient";
import BrowserSettingRepository from "../../repositories/BrowserSettingRepository";
import * as operations from "../../../shared/operations";

@injectable()
export default class NavigateOperatorFactoryChain
  implements OperatorFactoryChain
{
  constructor(
    @inject("TabPresenter")
    private readonly tabPresenter: TabPresenter,
    @inject("NavigateClient")
    private readonly navigateClient: NavigateClient,
    @inject("BrowserSettingRepository")
    private readonly browserSettingRepository: BrowserSettingRepository
  ) {}

  create(op: operations.Operation): Operator | null {
    switch (op.type) {
      case operations.NAVIGATE_HISTORY_PREV:
        return new NavigateHistoryPrevOperator(
          this.tabPresenter,
          this.navigateClient
        );
      case operations.NAVIGATE_HISTORY_NEXT:
        return new NavigateHistoryNextOperator(
          this.tabPresenter,
          this.navigateClient
        );
      case operations.NAVIGATE_LINK_PREV:
        return new NavigateLinkPrevOperator(
          this.tabPresenter,
          this.navigateClient
        );
      case operations.NAVIGATE_LINK_NEXT:
        return new NavigateLinkNextOperator(
          this.tabPresenter,
          this.navigateClient
        );
      case operations.NAVIGATE_PARENT:
        return new NavigateParentOperator(this.tabPresenter);
      case operations.NAVIGATE_ROOT:
        return new NavigateRootOperator(this.tabPresenter);
      case operations.PAGE_SOURCE:
        return new OpenSourceOperator(this.tabPresenter);
      case operations.PAGE_HOME:
        return new OpenHomeOperator(
          this.tabPresenter,
          this.browserSettingRepository,
          op.newTab
        );
    }
    return null;
  }
}
