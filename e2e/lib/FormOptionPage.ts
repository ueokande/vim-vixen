import { Lanthan } from "lanthan";
import { WebDriver, WebElement, By, error } from "selenium-webdriver";

export default class FormOptionPage {
  private webdriver: WebDriver;

  constructor(lanthan: Lanthan) {
    this.webdriver = lanthan.getWebDriver();
  }

  async setBlacklist(nth: number, url: string): Promise<void> {
    const fieldset = await this.getFieldsetByLegend("Blacklist");
    const rows = await fieldset.findElements(By.css("[role=listitem]"));
    if (rows.length <= nth) {
      throw new RangeError("Index out of range to set a blacklist");
    }

    const input = rows[nth].findElement(By.css("[aria-label=URL]"));
    await input.sendKeys(url);
    await this.blurActiveElement();
  }

  async setPartialBlacklist(
    nth: number,
    url: string,
    keys: string
  ): Promise<void> {
    const fieldset = await this.getFieldsetByLegend("Partial blacklist");
    const rows = await fieldset.findElements(By.css("[role=listitem]"));
    if (rows.length <= nth) {
      throw new RangeError("Index out of range to set a partial blacklist");
    }

    const urlInput = rows[nth].findElement(By.css("[aria-label=URL]"));
    await urlInput.sendKeys(url);
    await this.blurActiveElement();

    const keysInput = rows[nth].findElement(By.css("[aria-label=Keys]"));
    await keysInput.sendKeys(keys);
    await this.blurActiveElement();
  }

  async setSearchEngine(nth: number, name: string, url: string) {
    const fieldset = await this.getFieldsetByLegend("Search Engines");
    const rows = await fieldset.findElements(By.css("[role=listitem]"));
    if (rows.length <= nth) {
      throw new RangeError("Index out of range to set a search engine");
    }

    const nameInput = rows[nth].findElement(By.css("[aria-label=Name"));
    await nameInput.sendKeys(name);
    await this.blurActiveElement();

    const urlInput = rows[nth].findElement(By.css("[aria-label=URL]"));
    await urlInput.sendKeys(url);
    await this.blurActiveElement();
  }

  async addBlacklist(): Promise<void> {
    const fieldset = await this.getFieldsetByLegend("Blacklist");
    const rows = await fieldset.findElements(By.css("[role=listitem]"));
    const addButton = await fieldset.findElement(By.css("[aria-label=Add]"));

    await addButton.click();
    await this.webdriver.wait(async () => {
      const newRows = await fieldset.findElements(By.css("[role=listitem]"));
      return newRows.length == rows.length + 1;
    });
  }

  async addPartialBlacklist(): Promise<void> {
    const fieldset = await this.getFieldsetByLegend("Partial blacklist");
    const addButton = await fieldset.findElement(By.css("[aria-label=Add]"));
    const rows = await fieldset.findElements(By.css("[role=listitem]"));

    await addButton.click();
    await this.webdriver.wait(async () => {
      const newRows = await fieldset.findElements(By.css("[role=listitem]"));
      return newRows.length == rows.length + 1;
    });
  }

  async removeBlackList(nth: number): Promise<void> {
    const fieldset = await this.getFieldsetByLegend("Blacklist");
    const deleteButtons = await fieldset.findElements(
      By.css("[aria-label=Delete]")
    );
    if (deleteButtons.length <= nth) {
      throw new RangeError("Index out of range to remove blacklist");
    }
    await deleteButtons[nth].click();
  }

  async removePartialBlackList(nth: number): Promise<void> {
    const fieldset = await this.getFieldsetByLegend("Partial blacklist");
    const deleteButtons = await fieldset.findElements(
      By.css("[aria-label=Delete]")
    );
    if (deleteButtons.length <= nth) {
      throw new RangeError(
        `Index out of range ${deleteButtons.length} to remove partial blacklist ${nth}`
      );
    }
    await deleteButtons[nth].click();
  }

  async addSearchEngine(): Promise<void> {
    const fieldset = await this.getFieldsetByLegend("Search Engines");
    const rows = await fieldset.findElements(By.css("[role=listitem]"));
    const addButton = await fieldset.findElement(By.css("[aria-label=Add]"));

    await addButton.click();
    await this.webdriver.wait(async () => {
      const newRows = await fieldset.findElements(By.css("[role=listitem]"));
      return newRows.length == rows.length + 1;
    });
  }

  async setDefaultSearchEngine(nth: number): Promise<void> {
    const fieldset = await this.getFieldsetByLegend("Search Engines");
    const radios = await fieldset.findElements(
      By.css("[name=default][type=radio]")
    );
    if (radios.length <= nth) {
      throw new RangeError("Index out of range to set a default search engine");
    }
    await radios[nth].click();
  }

  private async getFieldsetByLegend(legendText: string): Promise<WebElement> {
    const fieldsets = await this.webdriver.findElements(By.tagName("fieldset"));
    for (const fieldset of fieldsets) {
      const legend = await fieldset.findElement(By.tagName("legend"));
      if ((await legend.getText()) === legendText) {
        return fieldset;
      }
    }
    throw new error.NoSuchElementError(
      `Unable to locate fieldset with legend: ` + legendText
    );
  }

  private async blurActiveElement(): Promise<void> {
    await this.webdriver.executeScript(`document.activeElement.blur()`);
  }
}
