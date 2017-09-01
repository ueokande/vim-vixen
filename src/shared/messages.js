const receive = (win, callback) => {
  win.addEventListener('message', (e) => {
    let message;
    try {
      message = JSON.parse(e.data);
    } catch (e) {
      // ignore message posted by author of web page
      return;
    }

    callback(message);
  })
}

const send = (win, message) => {
  win.postMessage(JSON.stringify(message), '*');
}

export { receive, send };
