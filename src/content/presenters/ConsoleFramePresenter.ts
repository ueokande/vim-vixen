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

    /* @ts-ignore */
    const colorScheme = getComputedStyle(document.body).colorScheme
    const iframe = document.createElement("iframe");
    iframe.src = browser.runtime.getURL("build/console.html?colorScheme=" + colorScheme);
    iframe.id = ConsoleFramePresenterImpl.IframeId;
    iframe.className = "vimvixen-console-frame";
    iframe.style.height = '0px';
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
    this.resize(0, 0)
    ele.blur();
  }

  resize(_width: number, height: number): void {
    const ele = document.getElementById("vimvixen-console-frame");
    if (!ele) {
      return;
    }
    ele.style.height = `${height}px`;
  }

  isTopWindow(): boolean {
    return window.top === window;
  }
}
