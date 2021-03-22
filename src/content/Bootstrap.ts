type Callback = () => void;

export default class Bootstrap {
  constructor() {}

  isReady(): boolean {
    return document.body !== null;
  }

  waitForReady(callback: Callback): void {
    const observer = new MutationObserver(() => {
      if (document.body != null) {
        observer.disconnect();
        callback();
      }
    });

    observer.observe(document, {
      attributes: false,
      attributeOldValue: false,
      characterData: false,
      characterDataOldValue: false,
      childList: true,
      subtree: true,
    });
  }
}
