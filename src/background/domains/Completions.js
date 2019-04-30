export default class Completions {
  constructor(groups) {
    this.g = groups;
  }

  get groups() {
    return this.g;
  }

  serialize() {
    return this.groups.map(group => ({
      name: group.name,
      items: group.items.map(item => ({
        caption: item.caption,
        content: item.content,
        url: item.url,
        icon: item.icon,
      })),
    }));
  }

  static empty() {
    return EMPTY_COMPLETIONS;
  }
}

let EMPTY_COMPLETIONS = new Completions([]);
