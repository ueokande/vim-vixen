import { WebDriver, By, until } from 'selenium-webdriver';
import { Console } from './Console';

type Hint = {
  displayed: boolean,
  text: string,
};

export default class Page {
  private constructor(private webdriver: WebDriver) {
  }

  static async currentContext(webdriver: WebDriver): Promise<Page> {
    await Page.waitForConsoleLoaded(webdriver);
    return new Page(webdriver);
  }

  static async navigateTo(webdriver: WebDriver, url: string): Promise<Page> {
    await webdriver.navigate().to(url);
    await Page.waitForConsoleLoaded(webdriver);
    return new Page(webdriver);
  }

  async sendKeys(...keys: Array<string|number|Promise<string|number>>): Promise<void> {
    const body = await this.webdriver.findElement(By.css('body'));
    await body.sendKeys(...keys);
  }

  async navigateTo(url: string): Promise<Page> {
    await this.webdriver.navigate().to(url);
    await Page.waitForConsoleLoaded(this.webdriver);
    return new Page(this.webdriver);
  }

  async showConsole(): Promise<Console> {
    const iframe = this.webdriver.findElement(By.css('#vimvixen-console-frame'));

    await this.sendKeys(':');
    await this.webdriver.wait(until.elementIsVisible(iframe));
    await this.webdriver.switchTo().frame(0);
    await this.webdriver.wait(until.elementLocated(By.css('input.vimvixen-console-command-input')));
    return new Console(this.webdriver);
  }

  async getConsole(): Promise<Console> {
    const iframe = this.webdriver.findElement(By.css('#vimvixen-console-frame'));

    await this.webdriver.wait(until.elementIsVisible(iframe));
    await this.webdriver.switchTo().frame(0);
    return new Console(this.webdriver);
  }

  async getScrollX(): Promise<number> {
    return await this.webdriver.executeScript(() => window.pageXOffset);
  }

  getScrollY(): Promise<number> {
    return this.webdriver.executeScript(() => window.pageYOffset);
  }

  scrollTo(x: number, y: number): Promise<void> {
    return this.webdriver.executeScript(`window.scrollTo(${x}, ${y})`);
  }

  pageHeight(): Promise<number> {
    return this.webdriver.executeScript(() => window.document.documentElement.clientHeight);
  }

  async waitAndGetHints(): Promise<Hint[]> {
    await this.webdriver.wait(until.elementsLocated(By.css('.vimvixen-hint')));

    const elements = await this.webdriver.findElements(By.css(`.vimvixen-hint`));
    const hints = [];
    for (const e of elements) {
      const display = await e.getCssValue('display');
      const text = await e.getText();
      hints.push({
        displayed: display !== 'none',
        text: text,
      });
    }
    return hints;
  }

  private static async waitForConsoleLoaded(webdriver: WebDriver) {
    const topFrame = await webdriver.executeScript(() => window.top === window);
    if (!topFrame) {
      return;
    }
    await webdriver.wait(until.elementLocated(By.css('iframe.vimvixen-console-frame')));
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}
