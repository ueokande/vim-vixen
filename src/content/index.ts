import 'reflect-metadata';

import Application from './Application';
import consoleFrameStyle from './site-style';
import { ConsoleFramePresenterImpl } from './presenters/ConsoleFramePresenter';
import { container } from 'tsyringe';
import './di';

if (window.self === window.top) {
  new ConsoleFramePresenterImpl().initialize();
}

try {
  let app = container.resolve(Application);
  app.run();
} catch (e) { console.error(e); }

let style = window.document.createElement('style');
style.textContent = consoleFrameStyle;
window.document.head.appendChild(style);
