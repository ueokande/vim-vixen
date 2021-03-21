import { WebDriver, By, until } from "selenium-webdriver";
import { Console } from "./Console";

type Hint = {
  displayed: boolean;
  text: string;
};

type Selection = {
  from: number;
  to: number;
};

export default class Page {
  private constructor(private webdriver: WebDriver) {}

  static async currentContext(webdriver: WebDriver): Promise<Page> {
    await Page.waitForPageCompleted(webdriver);
    return new Page(webdriver);
  }

  static async navigateTo(webdriver: WebDriver, url: string): Promise<Page> {
    await webdriver.navigate().to(url);
    await Page.waitForPageCompleted(webdriver);
    return new Page(webdriver);
  }

  async sendKeys(
    ...keys: Array<string | number | Promise<string | number>>
  ): Promise<void> {
    const body = await this.webdriver.findElement(By.css("body"));
    await body.sendKeys(...keys);
  }

  async navigateTo(url: string): Promise<Page> {
    await this.webdriver.navigate().to(url);
    await Page.waitForPageCompleted(this.webdriver);

    await new Promise((resolve) => setTimeout(resolve, 200));

    return new Page(this.webdriver);
  }

  async showConsole(): Promise<Console> {
    await this.sendKeys(":");
    const iframe = this.webdriver.findElement(By.id("vimvixen-console-frame"));
    await this.webdriver.wait(until.elementIsVisible(iframe));

    await this.webdriver.switchTo().frame(iframe);
    await this.webdriver.wait(until.elementLocated(By.css("input")));
    return new Console(this.webdriver);
  }

  async getConsole(): Promise<Console> {
    const iframe = this.webdriver.findElement(
      By.css("#vimvixen-console-frame")
    );
    await this.webdriver.wait(until.elementIsVisible(iframe));
    await this.webdriver.switchTo().frame(iframe);
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
    return this.webdriver.executeScript(
      () => window.document.documentElement.clientHeight
    );
  }

  async getSelection(): Promise<Selection> {
    const obj = (await this.webdriver.executeScript(
      `return window.getSelection();`
    )) as any;
    return { from: obj.anchorOffset, to: obj.focusOffset };
  }

  async clearSelection(): Promise<void> {
    await this.webdriver.executeScript(
      `window.getSelection().removeAllRanges()`
    );
  }

  async switchToTop(): Promise<void> {
    await this.webdriver.switchTo().defaultContent();
  }

  async waitAndGetHints(): Promise<Hint[]> {
    await this.webdriver.wait(until.elementsLocated(By.css(".vimvixen-hint")));

    const elements = await this.webdriver.findElements(
      By.css(`.vimvixen-hint`)
    );
    const hints = [];
    for (const e of elements) {
      const display = await e.getCssValue("display");
      const text = await e.getText();
      hints.push({
        displayed: display !== "none",
        text: text,
      });
    }
    return hints;
  }

  private static async waitForPageCompleted(
    webdriver: WebDriver
  ): Promise<void> {
    this.waitForDocumentCompleted(webdriver);

    const topFrame = await webdriver.executeScript(() => window.top === window);
    if (!topFrame) {
      return;
    }
    await webdriver.wait(until.elementLocated(By.id("vimvixen-console-frame")));
    await webdriver.switchTo().frame(0);
    await Page.waitForDocumentCompleted(webdriver);
    await webdriver.switchTo().parentFrame();
  }

  private static async waitForDocumentCompleted(webdriver: WebDriver) {
    await webdriver.wait(
      async () =>
        (await webdriver.executeScript("return document.readyState")) ===
        "complete"
    );
  }
}
