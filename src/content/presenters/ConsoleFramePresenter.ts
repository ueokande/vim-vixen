export default interface ConsoleFramePresenter {
  attach(): void;

  detach(): void;

  blur(): void;

  resize(width: number, height: number): void;

  isTopWindow(): boolean;
}

export class ConsoleFramePresenterImpl implements ConsoleFramePresenter {
  private static readonly IframeId = "vimvixen-console-frame" as const;

  attach(): void {
    const ele = document.getElementById("vimvixen-console-frame");
    if (ele) {
      return;
    }

    const iframe = document.createElement("iframe");
    iframe.src = browser.runtime.getURL("build/console.html");
    iframe.id = ConsoleFramePresenterImpl.IframeId;
    iframe.className = "vimvixen-console-frame";
    document.body.append(iframe);
  }

  detach(): void {
    const ele = document.getElementById(ConsoleFramePresenterImpl.IframeId);
    if (!ele) {
      return;
    }
    ele.remove();
  }

  blur(): void {
    const ele = document.getElementById("vimvixen-console-frame");
    if (!ele) {
      return;
    }
    ele.blur();
  }

  resize(_width: number, _height: number): void {
    return;
  }

  isTopWindow(): boolean {
    return window.top === window;
  }
}
