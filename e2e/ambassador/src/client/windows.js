import {
  WINDOWS_CREATE, WINDOWS_REMOVE, WINDOWS_GET
} from '../shared/messages';
import * as ipc from './ipc';

const create = (url) => {
  return ipc.send({
    type: WINDOWS_CREATE,
    url,
  });
};

const remove = (windowId) => {
  return ipc.send({
    type: WINDOWS_REMOVE,
    windowId,
  });
};

const get = (windowId) => {
  return ipc.send({
    type: WINDOWS_GET,
    windowId,
  });
};

export { create, remove, get };
