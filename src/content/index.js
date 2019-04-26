import { createStore, applyMiddleware } from 'redux';
import promise from 'redux-promise';
import reducers from 'content/reducers';
import TopContentComponent from './components/top-content';
import FrameContentComponent from './components/frame-content';
import consoleFrameStyle from './site-style';

const store = createStore(
  reducers,
  applyMiddleware(promise),
);

if (window.self === window.top) {
  new TopContentComponent(window, store); // eslint-disable-line no-new
} else {
  new FrameContentComponent(window, store); // eslint-disable-line no-new
}

let style = window.document.createElement('style');
style.textContent = consoleFrameStyle.default;
window.document.head.appendChild(style);
