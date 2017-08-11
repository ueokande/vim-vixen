const initialize = (url) => {
  let p = document.createElement("p");
  p.textContent = "Hello Vim Vixen";
  p.style.position = 'fixed';
  p.style.right = '0';
  p.style.bottom = '0';
  p.style.padding = '0rem .5rem';
  p.style.margin = '0';
  p.style.backgroundColor = 'lightgray';
  p.style.border = 'gray';
  p.style.boxShadow = '0 0 2px gray inset';
  p.style.borderRadius = '3px';
  p.style.fontFamily = 'monospace';

  document.body.append(p)
}

export { initialize };
