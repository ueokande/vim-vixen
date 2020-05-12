export default class HintKeyProducer {
  private charset: string;

  private counter: number[];

  constructor(charset: string) {
    if (charset.length === 0) {
      throw new TypeError("charset is empty");
    }

    this.charset = charset;
    this.counter = [];
  }

  setNumberOfHints(nHints: number): void {
    const charsPrKey: number = Math.ceil(
      Math.log(nHints) / Math.log(this.charset.length)
    );
    this.counter = new Array(charsPrKey).fill(0);
  }

  produce(): string {
    this.increment();

    return this.counter.map((x) => this.charset[x]).join("");
  }

  private increment(): void {
    const max = this.charset.length - 1;
    if (this.counter.every((x) => x === max)) {
      this.counter = new Array(this.counter.length + 1).fill(0);
      return;
    }

    this.counter.reverse();
    const len = this.charset.length;
    let num = this.counter.reduce((x, y, index) => x + y * len ** index) + 1;
    for (let i = 0; i < this.counter.length; ++i) {
      this.counter[i] = num % len;
      num = ~~(num / len);
    }
    this.counter.reverse();
  }
}
