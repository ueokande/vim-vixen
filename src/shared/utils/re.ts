const fromWildcard = (pattern: string): RegExp => {
  let regexStr = '^' + pattern.replace(/\*/g, '.*') + '$';
  return new RegExp(regexStr);
};

export { fromWildcard };
