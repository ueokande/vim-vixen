import "reflect-metadata";

import Application from "./Application";
import consoleFrameStyle from "./site-style";
import { ConsoleFramePresenterImpl } from "./presenters/ConsoleFramePresenter";
import { container } from "tsyringe";
import "./di";

if (window.self === window.top) {
  new ConsoleFramePresenterImpl().initialize();
}

try {
  const app = container.resolve(Application);
  app.run();
} catch (e) {
  console.error(e);
}

const style = window.document.createElement("style");
style.textContent = consoleFrameStyle;
window.document.head.appendChild(style);
