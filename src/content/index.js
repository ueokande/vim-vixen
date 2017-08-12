window.addEventListener("keypress", (e) => {
  browser.runtime.sendMessage({
    key: e.which || e.keyCode,
    shift: e.shift,
    alt: e.alt,
    meta: e.meta,
    ctrl: e.ctrl,
  }).then(() => {
  }, (err) => {
    console.log(`Vim Vixen: ${err}`);
  });
});
