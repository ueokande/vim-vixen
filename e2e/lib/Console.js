class Console {
  constructor(session) {
    this.session = session;
  }

  async sendKeys(...keys) {
    let input = await this.session.findElementByCSS('input');
    input.sendKeys(...keys);
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
          objs.push({ type: 'item', text: li.textContent.trim() });
        } else {
          throw new Error(`unexpected class: ${li.className}`);
        }
      }
      return objs;
    });
  }
}

module.exports = Console;
