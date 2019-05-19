import { ConsoleFramePresenterImpl } from './presenters/ConsoleFramePresenter';
import consoleFrameStyle from './site-style';
import * as routes from './routes';

if (window.self === window.top) {
  routes.routeMasterComponents();

  new ConsoleFramePresenterImpl().initialize();
}

routes.routeComponents();


let style = window.document.createElement('style');
style.textContent = consoleFrameStyle;
window.document.head.appendChild(style);
