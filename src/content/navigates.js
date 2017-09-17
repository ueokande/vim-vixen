const historyPrev = (win) => {
  win.history.back();
};
const historyNext = (win) => {
  win.history.forward();
};

export { historyPrev, historyNext };
