import { TABS_CREATE } from '../shared/messages';
import * as ipc from './ipc';

const create = (windowId, url) => {
  return ipc.send({
    type: TABS_CREATE,
    windowId,
    url,
  });
};

export { create };
