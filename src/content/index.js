window.addEventListener("keypress", (e) => {
  browser.runtime.sendMessage({
    which: e.which || e.keyCode,
  }).then((msg) => {
    console.log(`Message from the background script:  ${msg.response}`);
  }, (err) => {
    console.log(`Error: ${err}`);
  });
});
