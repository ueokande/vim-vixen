import MarkKeyRepository, { MarkKeyRepositoryImpl }
  from '../repositories/MarkKeyRepository';

export default class MarkKeyUseCase {
  private repository: MarkKeyRepository;

  constructor({
    repository = new MarkKeyRepositoryImpl()
  } = {}) {
    this.repository = repository;
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
