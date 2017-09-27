import './settings.scss';
import DefaultSettings from './default-settings';

let form = document.getElementById('vimvixen-settings-form');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  browser.storage.local.set({
    settings: {
      json: e.target.elements['plain-json'].value
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  browser.storage.local.get('settings').then((value) => {
    if (value.settings.json) {
      form.elements['plain-json'].value = value.settings.json;
    } else {
      form.elements['plain-json'].value = 
        JSON.stringify(DefaultSettings, null, 2);
    }
  }, console.error);
});
