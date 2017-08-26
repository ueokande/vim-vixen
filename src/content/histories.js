const prev = (win) => {
  win.history.back()
};
const next = (win) => {
  win.history.forward()
};

export { prev, next };
