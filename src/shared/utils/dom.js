const isContentEditable = (element) => {
  return element.hasAttribute('contenteditable') && (
    element.getAttribute('contenteditable').toLowerCase() === 'true' ||
    element.getAttribute('contenteditable').toLowerCase() === ''
  );
};

const rectangleCoordsRect = (coords) => {
  let [left, top, right, bottom] = coords.split(',').map(n => Number(n));
  return { left, top, right, bottom };
};

const circleCoordsRect = (coords) => {
  let [x, y, r] = coords.split(',').map(n => Number(n));
  return {
    left: x - r,
    top: y - r,
    right: x + r,
    bottom: y + r,
  };
};

const polygonCoordsRect = (coords) => {
  let params = coords.split(',');
  let minx = Number(params[0]),
    maxx = Number(params[0]),
    miny = Number(params[1]),
    maxy = Number(params[1]);
  let len = Math.floor(params.length / 2);
  for (let i = 2; i < len; i += 2) {
    let x = Number(params[i]),
      y = Number(params[i + 1]);
    if (x < minx) {
      minx = x;
    }
    if (x > maxx) {
      maxx = x;
    }
    if (y < miny) {
      miny = y;
    }
    if (y > maxy) {
      maxy = y;
    }
  }
  return { left: minx, top: miny, right: maxx, bottom: maxy };
};

const viewportRect = (e) => {
  if (e.tagName !== 'AREA') {
    return e.getBoundingClientRect();
  }

  let mapElement = e.parentNode;
  let imgElement = document.querySelector(`img[usemap="#${mapElement.name}"]`);
  let {
    left: mapLeft,
    top: mapTop
  } = imgElement.getBoundingClientRect();
  let coords = e.getAttribute('coords');
  let rect = { left: 0, top: 0, right: 0, bottom: 0 };
  switch (e.getAttribute('shape')) {
  case 'rect':
  case 'rectangle':
    rect = rectangleCoordsRect(coords);
    break;
  case 'circ':
  case 'circle':
    rect = circleCoordsRect(coords);
    break;
  case 'poly':
  case 'polygon':
    rect = polygonCoordsRect(coords);
    break;
  }
  return {
    left: rect.left + mapLeft,
    top: rect.top + mapTop,
    right: rect.right + mapLeft,
    bottom: rect.bottom + mapTop,
  };
};

const isVisible = (element) => {
  let rect = element.getBoundingClientRect();
  let style = window.getComputedStyle(element);

  if (style.overflow !== 'visible' && (rect.width === 0 || rect.height === 0)) {
    return false;
  }
  if (rect.right < 0 && rect.bottom < 0) {
    return false;
  }
  if (window.innerWidth < rect.left && window.innerHeight < rect.top) {
    return false;
  }
  if (element.nodeName === 'INPUT' && element.type.toLowerCase() === 'hidden') {
    return false;
  }

  let { display, visibility } = window.getComputedStyle(element);
  if (display === 'none' || visibility === 'hidden') {
    return false;
  }
  return true;
};

export { isContentEditable, viewportRect, isVisible };
