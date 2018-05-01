const get = () => {
  let element = document.documentElement;
  return {
    xMax: element.scrollWidth - element.clientWidth,
    yMax: element.scrollHeight - element.clientHeight,
    x: element.scrollLeft,
    y: element.scrollTop,
    frameWidth: element.clientWidth,
    frameHeight: element.clientHeight,
  };
};

const set = (x, y) => {
  let element = document.documentElement;
  element.scrollLeft = x;
  element.scrollTop = y;
  return get();
};

export { get, set };
