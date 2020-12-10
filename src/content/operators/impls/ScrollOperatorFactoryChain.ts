import { inject, injectable } from "tsyringe";
import OperatorFactoryChain from "../OperatorFactoryChain";
import ScrollPresenter from "../../presenters/ScrollPresenter";
import SettingRepository from "../../repositories/SettingRepository";
import * as operations from "../../../shared/operations";
import Operator from "../Operator";
import VerticalScrollOperator from "./VerticalScrollOperator";
import HorizontalScrollOperator from "./HorizontalScrollOperator";
import PageScrollOperator from "./PageScrollOperator";
import ScrollToTopOperator from "./ScrollToTopOperator";
import ScrollToBottomOperator from "./ScrollToBottomOperator";
import ScrollToHomeOperator from "./ScrollToHomeOperator";
import ScrollToEndOperator from "./ScrollToEndOperator";

@injectable()
export default class ScrollOperatorFactoryChain
  implements OperatorFactoryChain {
  constructor(
    @inject("ScrollPresenter")
    private readonly scrollPresenter: ScrollPresenter,
    @inject("SettingRepository")
    private readonly settingRepository: SettingRepository
  ) {}

  create(op: operations.Operation, repeat: number): Operator | null {
    switch (op.type) {
      case operations.SCROLL_VERTICALLY:
        return new VerticalScrollOperator(
          this.scrollPresenter,
          this.settingRepository,
          op.count * repeat
        );
      case operations.SCROLL_HORIZONALLY:
        return new HorizontalScrollOperator(
          this.scrollPresenter,
          this.settingRepository,
          op.count * repeat
        );
      case operations.SCROLL_PAGES:
        return new PageScrollOperator(
          this.scrollPresenter,
          this.settingRepository,
          op.count * repeat
        );
      case operations.SCROLL_TOP:
        return new ScrollToTopOperator(
          this.scrollPresenter,
          this.settingRepository
        );
      case operations.SCROLL_BOTTOM:
        return new ScrollToBottomOperator(
          this.scrollPresenter,
          this.settingRepository
        );
      case operations.SCROLL_HOME:
        return new ScrollToHomeOperator(
          this.scrollPresenter,
          this.settingRepository
        );
      case operations.SCROLL_END:
        return new ScrollToEndOperator(
          this.scrollPresenter,
          this.settingRepository
        );
    }
    return null;
  }
}
