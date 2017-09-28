import './settings.scss';

document.addEventListener('DOMContentLoaded', () => {
  let form = document.getElementById('vimvixen-settings-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    browser.storage.local.set({
      settings: {
        json: e.target.elements['plain-json'].value
      }
    });
  });

  browser.storage.local.get('settings').then((value) => {
    form.elements['plain-json'].value = value.settings.json;
  }, console.error);
});
