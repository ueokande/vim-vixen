import messages from 'shared/messages';

const error = async(tab, text) => {
  await browser.tabs.sendMessage(tab.id, {
    type: messages.CONSOLE_SHOW_ERROR,
    text,
  });
  return { type: '' };
};

const info = async(tab, text) => {
  await browser.tabs.sendMessage(tab.id, {
    type: messages.CONSOLE_SHOW_INFO,
    text,
  });
  return { type: '' };
};

const showCommand = async(tab, command) => {
  await browser.tabs.sendMessage(tab.id, {
    type: messages.CONSOLE_SHOW_COMMAND,
    command,
  });
  return { type: '' };
};

const showFind = async(tab) => {
  await browser.tabs.sendMessage(tab.id, {
    type: messages.CONSOLE_SHOW_FIND
  });
  return { type: '' };
};

const hide = async(tab) => {
  await browser.tabs.sendMessage(tab.id, {
    type: messages.CONSOLE_HIDE,
  });
  return { type: '' };
};

export { error, info, showCommand, showFind, hide };
