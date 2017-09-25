import './settings.scss';

let form = document.getElementById('vimvixen-settings-form');

form.addEventListener('submit', (e) => {
  let value = {
    json: e.target.elements['plain-json'].value
  };
  e.preventDefault();
  browser.storage.local.set(value);
});

document.addEventListener('DOMContentLoaded', () => {
  browser.storage.local.get().then((value) => {
    if (value.json) {
      form.elements['plain-json'].value = value.json;
    }
  }, console.error);
});
