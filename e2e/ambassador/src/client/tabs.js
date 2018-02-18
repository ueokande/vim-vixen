import {
  TABS_CREATE, TABS_SELECT_AT,
} from '../shared/messages';
import * as ipc from './ipc';

const create = (windowId, url) => {
  return ipc.send({
    type: TABS_CREATE,
    windowId,
    url,
  });
};

const selectAt = (windowId, index) => {
  return ipc.send({
    type: TABS_SELECT_AT,
    windowId,
    index,
  });
};

export { create, selectAt };
