import "reflect-metadata";

import Application from "./Application";
import Bootstrap from "./Bootstrap";
import consoleFrameStyle from "./site-style";
import { container } from "tsyringe";
import "./di";

const initDom = () => {
  (async () => {
    try {
      const app = container.resolve(Application);
      await app.init();
    } catch (e) {
      console.error(e);
    }
  })();

  const style = window.document.createElement("style");
  style.textContent = consoleFrameStyle;
  window.document.head.appendChild(style);
};

const bootstrap = new Bootstrap();
if (bootstrap.isReady()) {
  initDom();
} else {
  bootstrap.waitForReady(() => initDom());
}
