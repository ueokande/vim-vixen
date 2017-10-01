import * as settingActions from '../actions/setting';
import { validate } from '../shared/validators/setting';

export default class SettingComponent {
  constructor(wrapper, store) {
    this.wrapper = wrapper;
    this.store = store;

    let doc = wrapper.ownerDocument;
    let form = doc.getElementById('vimvixen-settings-form');
    form.addEventListener('submit', this.onSubmit.bind(this));

    let plainJson = form.elements['plain-json'];
    plainJson.addEventListener('input', this.onPlainJsonChanged.bind(this));

    store.dispatch(settingActions.load());
  }

  onSubmit(e) {
    let settings = {
      json: e.target.elements['plain-json'].value,
    };
    this.store.dispatch(settingActions.save(settings));
    e.preventDefault();
  }

  onPlainJsonChanged(e) {
    try {
      let settings = JSON.parse(e.target.value);
      validate(settings);
      e.target.setCustomValidity('');
    } catch (err) {
      e.target.setCustomValidity(err.message);
    }
  }

  update() {
    let { settings } = this.store.getState();

    let doc = this.wrapper.ownerDocument;
    let form = doc.getElementById('vimvixen-settings-form');
    let plainJsonInput = form.elements['plain-json'];
    plainJsonInput.value = settings.json;
  }
}
