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
    const smooth = this.getSmoothScroll();
    this.presenter.scrollVertically(count, smooth);
  }

  scrollHorizonally(count: number): void {
    const smooth = this.getSmoothScroll();
    this.presenter.scrollHorizonally(count, smooth);
  }

  scrollPages(count: number): void {
    const smooth = this.getSmoothScroll();
    this.presenter.scrollPages(count, smooth);
  }

  scrollToTop(): void {
    const smooth = this.getSmoothScroll();
    this.presenter.scrollToTop(smooth);
  }

  scrollToBottom(): void {
    const smooth = this.getSmoothScroll();
    this.presenter.scrollToBottom(smooth);
  }

  scrollToHome(): void {
    const smooth = this.getSmoothScroll();
    this.presenter.scrollToHome(smooth);
  }

  scrollToEnd(): void {
    const smooth = this.getSmoothScroll();
    this.presenter.scrollToEnd(smooth);
  }

  private getSmoothScroll(): boolean {
    const settings = this.settingRepository.get();
    return settings.properties.smoothscroll;
  }
}
