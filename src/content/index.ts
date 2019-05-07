import TopContentComponent from './components/top-content';
import FrameContentComponent from './components/frame-content';
import consoleFrameStyle from './site-style';
import { newStore } from './store';

const store = newStore();

if (window.self === window.top) {
  new TopContentComponent(window, store); // eslint-disable-line no-new
} else {
  new FrameContentComponent(window, store); // eslint-disable-line no-new
}

let style = window.document.createElement('style');
style.textContent = consoleFrameStyle;
window.document.head.appendChild(style);
