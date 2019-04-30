export default class HintKeyProducer {
  constructor(charset) {
    if (charset.length === 0) {
      throw new TypeError('charset is empty');
    }

    this.charset = charset;
    this.counter = [];
  }

  produce() {
    this.increment();

    return this.counter.map(x => this.charset[x]).join('');
  }

  increment() {
    let max = this.charset.length - 1;
    if (this.counter.every(x => x === max)) {
      this.counter = new Array(this.counter.length + 1).fill(0);
      return;
    }

    this.counter.reverse();
    let len = this.charset.length;
    let num = this.counter.reduce((x, y, index) => x + y * len ** index) + 1;
    for (let i = 0; i < this.counter.length; ++i) {
      this.counter[i] = num % len;
      num = ~~(num / len);
    }
    this.counter.reverse();
  }
}
