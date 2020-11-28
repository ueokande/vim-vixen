import { inject, injectable } from "tsyringe";
import Operator from "../Operator";
import OperatorFactoryChain from "../OperatorFactoryChain";
import ScrollPresenter from "../../presenters/ScrollPresenter";
import SettingRepository from "../../repositories/SettingRepository";
import * as operations from "../../../shared/operations";

class AbstractScrollOperator {
  constructor(private readonly settingRepository: SettingRepository) {}

  protected getSmoothScroll(): boolean {
    const settings = this.settingRepository.get();
    return settings.properties.smoothscroll;
  }
}

export class VerticalScrollOperator
  extends AbstractScrollOperator
  implements Operator {
  constructor(
    private readonly presenter: ScrollPresenter,
    settingRepository: SettingRepository,
    private readonly count: number
  ) {
    super(settingRepository);
  }

  async run(): Promise<void> {
    const smooth = this.getSmoothScroll();
    this.presenter.scrollVertically(this.count, smooth);
  }
}

export class HorizonalScrollOperator
  extends AbstractScrollOperator
  implements Operator {
  constructor(
    private readonly presenter: ScrollPresenter,
    settingRepository: SettingRepository,
    private readonly count: number
  ) {
    super(settingRepository);
  }

  async run(): Promise<void> {
    const smooth = this.getSmoothScroll();
    this.presenter.scrollHorizonally(this.count, smooth);
  }
}

export class PageScrollOperator
  extends AbstractScrollOperator
  implements Operator {
  constructor(
    private readonly presenter: ScrollPresenter,
    settingRepository: SettingRepository,
    private readonly count: number
  ) {
    super(settingRepository);
  }

  async run(): Promise<void> {
    const smooth = this.getSmoothScroll();
    this.presenter.scrollPages(this.count, smooth);
  }
}

export class ScrollToTopOperator
  extends AbstractScrollOperator
  implements Operator {
  constructor(
    private readonly presenter: ScrollPresenter,
    settingRepository: SettingRepository
  ) {
    super(settingRepository);
  }

  async run(): Promise<void> {
    const smooth = this.getSmoothScroll();
    this.presenter.scrollToTop(smooth);
  }
}

export class ScrollToBottomOperator
  extends AbstractScrollOperator
  implements Operator {
  constructor(
    private readonly presenter: ScrollPresenter,
    settingRepository: SettingRepository
  ) {
    super(settingRepository);
  }

  async run(): Promise<void> {
    const smooth = this.getSmoothScroll();
    this.presenter.scrollToBottom(smooth);
  }
}

export class ScrollToHomeOperator
  extends AbstractScrollOperator
  implements Operator {
  constructor(
    private readonly presenter: ScrollPresenter,
    settingRepository: SettingRepository
  ) {
    super(settingRepository);
  }

  async run(): Promise<void> {
    const smooth = this.getSmoothScroll();
    this.presenter.scrollToHome(smooth);
  }
}

export class ScrollToEndOperator
  extends AbstractScrollOperator
  implements Operator {
  constructor(
    private readonly presenter: ScrollPresenter,
    settingRepository: SettingRepository
  ) {
    super(settingRepository);
  }

  async run(): Promise<void> {
    const smooth = this.getSmoothScroll();
    this.presenter.scrollToEnd(smooth);
  }
}

@injectable()
export class ScrollOperatorFactoryChain implements OperatorFactoryChain {
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
        return new HorizonalScrollOperator(
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
