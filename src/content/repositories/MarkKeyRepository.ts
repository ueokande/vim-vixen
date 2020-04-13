export default interface MarkKeyRepository {
  isSetMode(): boolean;

  enableSetMode(): void;

  disabeSetMode(): void;

  isJumpMode(): boolean;

  enableJumpMode(): void;

  disabeJumpMode(): void;
}

interface Mode {
  setMode: boolean;
  jumpMode: boolean;
}

const current: Mode = {
  setMode: false,
  jumpMode: false,
};

export class MarkKeyRepositoryImpl implements MarkKeyRepository {
  isSetMode(): boolean {
    return current.setMode;
  }

  enableSetMode(): void {
    current.setMode = true;
  }

  disabeSetMode(): void {
    current.setMode = false;
  }

  isJumpMode(): boolean {
    return current.jumpMode;
  }

  enableJumpMode(): void {
    current.jumpMode = true;
  }

  disabeJumpMode(): void {
    current.jumpMode = false;
  }
}
