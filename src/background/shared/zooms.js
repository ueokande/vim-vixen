// For chromium
// const ZOOM_SETTINGS = [
//   0.25, 0.33, 0.50, 0.66, 0.75, 0.80, 0.90, 1.00,
//   1.10, 1.25, 1.50, 1.75, 2.00, 2.50, 3.00, 4.00, 5.00
// ];

const ZOOM_SETTINGS = [
  0.33, 0.50, 0.66, 0.75, 0.80, 0.90, 1.00,
  1.10, 1.25, 1.50, 1.75, 2.00, 2.50, 3.00
];

const zoomIn = async(tabId = undefined) => {
  let current = await browser.tabs.getZoom(tabId);
  let factor = ZOOM_SETTINGS.find(f => f > current);
  if (factor) {
    return browser.tabs.setZoom(tabId, factor);
  }
};

const zoomOut = async(tabId = undefined) => {
  let current = await browser.tabs.getZoom(tabId);
  let factor = [].concat(ZOOM_SETTINGS).reverse().find(f => f < current);
  if (factor) {
    return browser.tabs.setZoom(tabId, factor);
  }
};

const neutral = (tabId = undefined) => {
  return browser.tabs.setZoom(tabId, 1);
};

export { zoomIn, zoomOut, neutral };
