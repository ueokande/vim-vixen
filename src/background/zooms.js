// For chromium
// const ZOOM_SETTINGS = [
//   0.25, 0.33, 0.50, 0.66, 0.75, 0.80, 0.90, 1.00,
//   1.10, 1.25, 1.50, 1.75, 2.00, 2.50, 3.00, 4.00, 5.00
// ];

const ZOOM_SETTINGS = [
  0.33, 0.50, 0.66, 0.75, 0.80, 0.90, 1.00,
  1.10, 1.25, 1.50, 1.75, 2.00, 2.50, 3.00
];

const zoomIn = (tabId = undefined) => {
  return browser.tabs.getZoom(tabId).then((factor) => {
    for (let f of ZOOM_SETTINGS) {
      if (f > factor) {
        browser.tabs.setZoom(tabId, f);
        break;
      }
    }
  });
};

const zoomOut = (tabId = undefined) => {
  return browser.tabs.getZoom(tabId).then((factor) => {
    for (let f of [].concat(ZOOM_SETTINGS).reverse()) {
      if (f < factor) {
        browser.tabs.setZoom(tabId, f);
        break;
      }
    }
  });
};

const neutral = (tabId = undefined) => {
  return browser.tabs.setZoom(tabId, 1);
};

export { zoomIn, zoomOut, neutral };
