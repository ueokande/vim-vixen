export default class CompletionItem {
  constructor({ caption, content, url, icon }) {
    this.caption0 = caption;
    this.content0 = content;
    this.url0 = url;
    this.icon0 = icon;
  }

  get caption() {
    return this.caption0;
  }

  get content() {
    return this.content0;
  }

  get url() {
    return this.url0;
  }

  get icon() {
    return this.icon0;
  }
}
