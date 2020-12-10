import AbstractScrollOperator from "./AbstractScrollOperator";
import Operator from "../Operator";
import ScrollPresenter from "../../presenters/ScrollPresenter";
import SettingRepository from "../../repositories/SettingRepository";

export default class PageScrollOperator
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
