const fromWildcard = (pattern) => {
  let regexStr = '^' + pattern.replace(/\*/g, '.*') + '$';
  return new RegExp(regexStr);
};

export { fromWildcard };
