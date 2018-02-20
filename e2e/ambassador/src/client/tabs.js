import {
  TABS_CREATE, TABS_SELECT_AT, TABS_GET_ZOOM, TABS_SET_ZOOM,
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

const getZoom = (tabId) => {
  return ipc.send({
    tabId,
    type: TABS_GET_ZOOM,
  });
};

const setZoom = (tabId, factor) => {
  return ipc.send({
    type: TABS_SET_ZOOM,
    tabId,
    factor,
  });
};

export { create, selectAt, getZoom, setZoom };
