import { injectable, inject } from 'tsyringe';
import ScrollPresenter from '../presenters/ScrollPresenter';
import SettingRepository from '../repositories/SettingRepository';

@injectable()
export default class ScrollUseCase {
  constructor(
    @inject('ScrollPresenter') private presenter: ScrollPresenter,
    @inject('SettingRepository') private settingRepository: SettingRepository,
  ) {
  }

  scrollVertically(count: number): void {
    let smooth = this.getSmoothScroll();
    this.presenter.scrollVertically(count, smooth);
  }

  scrollHorizonally(count: number): void {
    let smooth = this.getSmoothScroll();
    this.presenter.scrollHorizonally(count, smooth);
  }

  scrollPages(count: number): void {
    let smooth = this.getSmoothScroll();
    this.presenter.scrollPages(count, smooth);
  }

  scrollToTop(): void {
    let smooth = this.getSmoothScroll();
    this.presenter.scrollToTop(smooth);
  }

  scrollToBottom(): void {
    let smooth = this.getSmoothScroll();
    this.presenter.scrollToBottom(smooth);
  }

  scrollToHome(): void {
    let smooth = this.getSmoothScroll();
    this.presenter.scrollToHome(smooth);
  }

  scrollToEnd(): void {
    let smooth = this.getSmoothScroll();
    this.presenter.scrollToEnd(smooth);
  }

  private getSmoothScroll(): boolean {
    let settings = this.settingRepository.get();
    return settings.properties.smoothscroll;
  }
}
