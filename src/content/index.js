import './console-frame.scss';
import { createStore } from 'shared/store';
import reducers from 'content/reducers';
import TopContentComponent from './components/top-content';
import FrameContentComponent from './components/frame-content';

const store = createStore(reducers);

let rootComponent = window.self === window.top
  ? new TopContentComponent(window, store)
  : new FrameContentComponent(window, store);

store.subscribe(() => {
  rootComponent.update();
});

browser.runtime.onMessage.addListener(msg => rootComponent.onMessage(msg));
rootComponent.update();

window.addEventListener('message', (event) => {
  let message = null;
  try {
    message = JSON.parse(event.data);
  } catch (e) {
    // ignore unexpected message
    return;
  }
  rootComponent.onMessage(message, event.source);
});
