import ScrollPresenter, { ScrollPresenterImpl }
  from '../presenters/ScrollPresenter';
import SettingRepository, { SettingRepositoryImpl }
  from '../repositories/SettingRepository';

export default class ScrollUseCase {
  private presenter: ScrollPresenter;

  private settingRepository: SettingRepository;

  constructor({
    presenter = new ScrollPresenterImpl(),
    settingRepository = new SettingRepositoryImpl(),
  } = {}) {
    this.presenter = presenter;
    this.settingRepository = settingRepository;
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
