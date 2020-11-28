export default interface HintKeyRepository {
  reset(charset: string): void;

  produce(): string;
}

const current: {
  charset: string;
  counter: number[];
} = {
  charset: "",
  counter: [],
};

export class HintKeyRepositoryImpl implements HintKeyRepository {
  reset(charset: string): void {
    if (charset.length === 0) {
      throw new TypeError("charset is empty");
    }
    current.charset = charset;
    current.counter = [];
  }

  produce(): string {
    if (current.charset === "") {
      throw new Error("charset is not set");
    }
    this.increment();

    return current.counter.map((x) => current.charset[x]).join("");
  }

  private increment(): void {
    const max = current.charset.length - 1;
    if (current.counter.every((x) => x === max)) {
      current.counter = new Array(current.counter.length + 1).fill(0);
      return;
    }

    current.counter.reverse();
    const len = current.charset.length;
    let num = current.counter.reduce((x, y, index) => x + y * len ** index) + 1;
    for (let i = 0; i < current.counter.length; ++i) {
      current.counter[i] = num % len;
      num = ~~(num / len);
    }
    current.counter.reverse();
  }
}
