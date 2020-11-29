import MarkKeyRepository from "../../../src/content/repositories/MarkKeyRepository";

export default class MockMarkKeyRepository implements MarkKeyRepository {
  public jumpMode: boolean;
  public setMode: boolean;

  constructor(
    initialValue: {
      jumpMode: boolean;
      setMode: boolean;
    } = {
      jumpMode: false,
      setMode: false,
    }
  ) {
    this.jumpMode = initialValue.jumpMode;
    this.setMode = initialValue.setMode;
  }

  disabeJumpMode(): void {
    this.jumpMode = false;
  }

  disabeSetMode(): void {
    this.setMode = false;
  }

  enableJumpMode(): void {
    this.jumpMode = true;
  }

  enableSetMode(): void {
    this.setMode = true;
  }

  isJumpMode(): boolean {
    return this.jumpMode;
  }

  isSetMode(): boolean {
    return this.setMode;
  }
}
