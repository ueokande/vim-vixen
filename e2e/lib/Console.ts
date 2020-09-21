import { WebDriver, By, Key } from "selenium-webdriver";

export type CompletionGroups = {
  title: string;
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
    const p = await this.webdriver.findElement(By.css("[role=alert]"));
    return p.getText();
  }

  async getInformationMessage(): Promise<string> {
    const p = await this.webdriver.findElement(By.css("[role=status]"));
    return p.getText();
  }

  async inputKeys(...keys: string[]) {
    const input = await this.webdriver.findElement(By.css("input"));
    await input.sendKeys(...keys);
  }

  getCompletions(): Promise<CompletionGroups[]> {
    return this.webdriver.executeScript(() => {
      const groups = document.querySelectorAll("[role=group]");
      if (groups.length === 0) {
        throw new Error("completion items not found");
      }

      return Array.from(groups).map((group) => {
        const describedby = group.getAttribute("aria-describedby") as string;
        const title = document.getElementById(describedby)!;
        const items = group.querySelectorAll("[role=menuitem]");

        return {
          title: title.textContent!.trim(),
          items: Array.from(items).map((item) => ({
            text: document.getElementById(
              item.getAttribute("aria-labelledby")!
            )!.textContent,
            highlight: item.getAttribute("aria-selected") === "true",
          })),
        };
      });
    });
  }

  async getTheme(): Promise<string> {
    const color = (await this.webdriver.executeScript(() => {
      const input = document.querySelector("input")!;
      return window.getComputedStyle(input).backgroundColor;
    })) as string;
    if (color === "rgb(5, 32, 39)") {
      return "dark";
    } else if (color === "rgb(255, 255, 255)") {
      return "light";
    }
    throw new Error(`unknown input color: ${color}`);
  }

  async close(): Promise<void> {
    const input = await this.webdriver.findElement(By.css("input"));
    await input.sendKeys(Key.ESCAPE);
    // TODO remove sleep
    await new Promise((resolve) => setTimeout(resolve, 100));
    await (this.webdriver.switchTo() as any).parentFrame();
  }
}
