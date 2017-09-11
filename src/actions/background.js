import actions from '../actions';

export function requestCompletions(line) {
  let command = line.split(' ', 1)[0];
  let keywords = line.replace(command + ' ', '');
  return {
    type: actions.BACKGROUND_REQUEST_COMPLETIONS,
    command,
    keywords
  };
}
