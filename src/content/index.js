import './console-frame.scss';
import { createStore } from 'shared/store';
import reducers from 'content/reducers';
import TopContentComponent from './components/top-content';
import FrameContentComponent from './components/frame-content';

const store = createStore(reducers);

if (window.self === window.top) {
  new TopContentComponent(window, store); // eslint-disable-line no-new
} else {
  new FrameContentComponent(window, store); // eslint-disable-line no-new
}
