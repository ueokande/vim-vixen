import { WINDOWS_CREATE, WINDOWS_REMOVE } from '../shared/messages';
import * as ipc from './ipc';

ipc.receivePageMessage((message) => {
  switch (message.type) {
  case WINDOWS_CREATE:
    return ipc.send(message);
  case WINDOWS_REMOVE:
    return ipc.send(message);
  }
});
