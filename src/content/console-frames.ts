const initialize = (doc: Document): HTMLIFrameElement => {
  let iframe = doc.createElement('iframe');
  iframe.src = browser.runtime.getURL('build/console.html');
  iframe.id = 'vimvixen-console-frame';
  iframe.className = 'vimvixen-console-frame';
  doc.body.append(iframe);

  return iframe;
};

const blur = (doc: Document) => {
  let ele = doc.getElementById('vimvixen-console-frame') as HTMLIFrameElement;
  ele.blur();
};

export { initialize, blur };
