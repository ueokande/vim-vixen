export default class Completion {
  constructor(completions) {
    if (typeof completions.length !== 'number') {
      throw new TypeError('completions does not have a length in number');
    }
    this.completions = completions
    this.index = 0;
  }

  prev() {
    if (this.completions.length === 0) {
      return null;
    }
    this.index = (this.index + this.completions.length - 1) % this.completions.length
    return this.completions[this.index];
  }

  next() {
    if (this.completions.length === 0) {
      return null;
    }
    let item = this.completions[this.index];
    this.index = (this.index + 1) % this.completions.length
    return item;
  }
}
