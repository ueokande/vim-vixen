import './footer-line.css';

export default class FooterLine {
  constructor(doc) {
    this.title = doc.createElement('p');
    this.title.className = 'vimvixen-footerline-title';

    this.input = doc.createElement('input');
    this.input.className = 'vimvixen-footerline-input';

    this.wrapper = doc.createElement('div');
    this.wrapper.className = 'vimvixen-footerline';

    this.wrapper.append(this.title);
    this.wrapper.append(this.input);
    doc.body.append(this.wrapper)

    this.input.addEventListener('blur', this.handleBlur.bind(this));
    this.input.addEventListener('keydown', this.handleKeydown.bind(this));
  }

  focus() {
    this.input.focus();
  }

  remove() {
    this.wrapper.remove();
  }

  handleBlur() {
    this.remove();
  }

  handleKeydown(e) {
    if (e.keyCode === KeyboardEvent.DOM_VK_ESCAPE) {
      this.remove();
    }
  }
}
