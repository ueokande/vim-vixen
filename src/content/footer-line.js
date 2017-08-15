import './footer-line.css';

export default class FooterLine {
  constructor(doc, initial = '') {
    this.initUi(doc);

    this.enteredCallback = () => {}
    this.promptChangeCallback = () => {}

    this.input.addEventListener('blur', this.handleBlur.bind(this));
    this.input.addEventListener('keydown', this.handleKeydown.bind(this));
    this.input.addEventListener('keyup', this.handleKeyup.bind(this));
    this.input.value = initial;
  }

  initUi(doc) {
    this.title = doc.createElement('p');
    this.title.className = 'vimvixen-footerline-title';

    let containerInner = doc.createElement('div');
    containerInner.className = 'vimvixen-footerline-container-inner';

    let containerOuter = doc.createElement('div');
    containerOuter.className = 'vimvixen-footerline-container-outer';

    this.input = doc.createElement('input');
    this.input.className = 'vimvixen-footerline-input';

    this.wrapper = doc.createElement('div');
    this.wrapper.className = 'vimvixen-footerline';

    containerOuter.append(containerInner);
    containerInner.append(this.input);
    this.wrapper.append(this.title);
    this.wrapper.append(containerOuter);
    doc.body.append(this.wrapper)
  }

  focus() {
    this.input.focus();
  }

  remove() {
    this.wrapper.remove();
  }

  onPromptChange(callback) {
    this.promptChangeCallback = callback;
  }

  onEntered(callback) {
    this.enteredCallback = callback;
  }

  handleBlur() {
    this.remove();
  }

  handleKeydown(e) {
    this.prevValue = e.target.value;
    switch(e.keyCode) {
    case KeyboardEvent.DOM_VK_ESCAPE:
      this.remove();
      break;
    case KeyboardEvent.DOM_VK_RETURN:
      this.enteredCallback(e);
      break;
    }
  }

  handleKeyup(e) {
    if (e.target.value === this.prevValue) {
      return;
    }
    this.promptChangeCallback(e);
    this.prevValue = e.target.value;
  }
}
