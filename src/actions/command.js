import actions from '../actions';

const normalizeUrl = (string) => {
  try {
    return new URL(string).href
  } catch (e) {
    return 'http://' + string;
  }
}

export function exec(line) {
  let name = line.split(' ')[0];
  let remaining = line.replace(name + ' ', '');

  switch (name) {
  case 'open':
    // TODO use search engined and pass keywords to them
    return {
      type: actions.COMMAND_OPEN_URL,
      url: normalizeUrl(remaining)
    };
  case 'tabopen':
    return {
      type: actions.COMMAND_TABOPEN_URL,
      url: remaining
    };
  case 'b':
  case 'buffer':
    return {
      type: actions.COMMAND_BUFFER,
      keywords: remaining
    };
  }
  throw new Error(name + ' command is not defined');
}
