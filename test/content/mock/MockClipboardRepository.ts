import ClipboardRepository from "../../../src/content/repositories/ClipboardRepository";

export default class MockClipboardRepository implements ClipboardRepository {
  private value: string;

  constructor(initValue = "") {
    this.value = initValue;
  }
  read(): string {
    return this.value;
  }

  write(text: string): void {
    this.value = text;
  }
}
