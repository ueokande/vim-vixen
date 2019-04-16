class Console {
  constructor(session) {
    this.session = session;
  }

  async sendKeys(...keys) {
    let input = await this.session.findElementByCSS('input');
    input.sendKeys(...keys);
  }

  async currentValue() {
    return await this.session.executeScript(() => {
      let input = document.querySelector('input');
      return input.value;
    });
  }

  async getCompletions() {
    return await this.session.executeScript(() => {
      let items = document.querySelectorAll('.vimvixen-console-completion > li');
      if (items.length === 0) {
        throw new Error('completion items not found');
      }

      let objs = [];
      for (let li of items) {
        if (li.classList.contains('vimvixen-console-completion-title')) {
          objs.push({ type: 'title', text: li.textContent.trim() });
        } else if ('vimvixen-console-completion-item') {
          let highlight = li.classList.contains('vimvixen-completion-selected');
          objs.push({ type: 'item', text: li.textContent.trim(), highlight });
        } else {
          throw new Error(`unexpected class: ${li.className}`);
        }
      }
      return objs;
    });
  }
}

module.exports = Console;
