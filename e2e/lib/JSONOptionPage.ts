import { Lanthan } from "lanthan";
import { WebDriver, By } from "selenium-webdriver";

export default class JSONOptionPage {
  private webdriver: WebDriver;

  constructor(lanthan: Lanthan) {
    this.webdriver = lanthan.getWebDriver();
  }

  async updateSettings(value: string): Promise<void> {
    const textarea = await this.webdriver.findElement(By.css("textarea"));
    await this.webdriver.executeScript(
      `document.querySelector('textarea').value = '${value}'`
    );
    await textarea.sendKeys(" ");
    await this.webdriver.executeScript(() =>
      document.querySelector("textarea")!.blur()
    );
  }

  async getErrorMessage(): Promise<string> {
    const error = await this.webdriver.findElement(
      By.css(".settings-ui-input-error")
    );
    return error.getText();
  }
}
