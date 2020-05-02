export default interface ConsoleFramePresenter {
  initialize(): void;

  blur(): void;
}

export class ConsoleFramePresenterImpl implements ConsoleFramePresenter {
  initialize(): void {
    const iframe = document.createElement("iframe");
    iframe.src = browser.runtime.getURL("build/console.html");
    iframe.id = "vimvixen-console-frame";
    iframe.className = "vimvixen-console-frame";
    document.body.append(iframe);
  }

  blur(): void {
    const ele = document.getElementById("vimvixen-console-frame");
    if (!ele) {
      throw new Error("console frame not created");
    }
    ele.blur();
  }
}
