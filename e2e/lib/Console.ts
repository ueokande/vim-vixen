import { WebDriver, By, Key } from "selenium-webdriver";

export type CompletionGroups = {
  name: string;
  items: Array<CompletionItem>;
};

export type CompletionItem = {
  text: string;
  highlight: boolean;
};

export class Console {
  constructor(private webdriver: WebDriver) {}

  async sendKeys(...keys: string[]) {
    const input = await this.webdriver.findElement(By.css("input"));
    input.sendKeys(...keys);
  }

  async currentValue() {
    return await this.webdriver.executeScript(() => {
      const input = document.querySelector("input");
      if (input === null) {
        throw new Error("could not find input element");
      }
      return input.value;
    });
  }

  async execCommand(command: string): Promise<void> {
    const input = await this.webdriver.findElement(By.css("input"));
    await input.sendKeys(command, Key.ENTER);
  }

  async getErrorMessage(): Promise<string> {
    const p = await this.webdriver.findElement(
      By.css(".vimvixen-console-error")
    );
    return p.getText();
  }

  async getInformationMessage(): Promise<string> {
    const p = await this.webdriver.findElement(
      By.css(".vimvixen-console-info")
    );
    return p.getText();
  }

  async inputKeys(...keys: string[]) {
    const input = await this.webdriver.findElement(By.css("input"));
    await input.sendKeys(...keys);
  }

  getCompletions(): Promise<CompletionItem[]> {
    return this.webdriver.executeScript(() => {
      const groups = document.querySelectorAll("[role=group]");
      if (groups.length === 0) {
        throw new Error("completion items not found");
      }

      return Array.from(groups).map((group) => ({
        name: group.textContent!.trim(),
        items: Array.from(group.querySelectorAll("[role=menuitem]")).map(
          (item) => ({
            text: item.textContent!.trim(),
            highlight: item.getAttribute("aria-selected") === "true",
          })
        ),
      }));
    });
  }

  async getTheme(): Promise<string> {
    const wrapper = await this.webdriver.findElement(By.css("div[data-theme]"));
    const theme = await wrapper.getAttribute("data-theme");
    return theme;
  }

  async close(): Promise<void> {
    const input = await this.webdriver.findElement(By.css("input"));
    await input.sendKeys(Key.ESCAPE);
    // TODO remove sleep
    await new Promise((resolve) => setTimeout(resolve, 100));
    await (this.webdriver.switchTo() as any).parentFrame();
  }
}
