import { injectable, inject } from 'tsyringe';
import MarkKeyRepository from '../repositories/MarkKeyRepository';

@injectable()
export default class MarkKeyUseCase {
  constructor(
    @inject('MarkKeyRepository') private repository: MarkKeyRepository,
  ) {
  }

  isSetMode(): boolean {
    return this.repository.isSetMode();
  }

  isJumpMode(): boolean {
    return this.repository.isJumpMode();
  }

  enableSetMode(): void {
    this.repository.enableSetMode();
  }

  disableSetMode(): void {
    this.repository.disabeSetMode();
  }

  enableJumpMode(): void {
    this.repository.enableJumpMode();
  }

  disableJumpMode(): void {
    this.repository.disabeJumpMode();
  }
}
