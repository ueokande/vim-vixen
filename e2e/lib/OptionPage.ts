import { Lanthan } from 'lanthan';
import { WebDriver, By } from 'selenium-webdriver';
import JSONOptionPage from './JSONOptionPage';
import FormOptionPage from './FormOptionPage';

export default class OptionPage {
  private webdriver: WebDriver;

  constructor(private lanthan: Lanthan) {
    this.webdriver = lanthan.getWebDriver();
  }

  static async open(lanthan: Lanthan) {
    const url = await lanthan.getWebExtBrowser().runtime.getURL("build/settings.html")
    await lanthan.getWebDriver().navigate().to(url);
    return new OptionPage(lanthan);
  }

  async switchToForm(): Promise<FormOptionPage> {
    const useFormInput = await this.webdriver.findElement(By.css('#setting-source-form'));
    await useFormInput.click();
    await this.webdriver.switchTo().alert().accept();
    return new FormOptionPage(this.lanthan);
  }

  async asFormOptionPage(): Promise<FormOptionPage> {
    // TODO validate current page
    return new FormOptionPage(this.lanthan);
  }

  async asJSONOptionPage(): Promise<JSONOptionPage> {
    // TODO validate current page
    return new JSONOptionPage(this.lanthan);
  }

  scrollTo(x: number, y: number): Promise<void> {
    return this.webdriver.executeScript(`window.scrollTo(${x}, ${y})`);
  }
}
