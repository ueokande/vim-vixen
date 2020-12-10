import { injectable, inject } from "tsyringe";
import MarkKeyRepository from "../repositories/MarkKeyRepository";

@injectable()
export default class MarkKeyUseCase {
  constructor(
    @inject("MarkKeyRepository") private repository: MarkKeyRepository
  ) {}

  isSetMode(): boolean {
    return this.repository.isSetMode();
  }

  isJumpMode(): boolean {
    return this.repository.isJumpMode();
  }

  disableSetMode(): void {
    this.repository.disabeSetMode();
  }

  disableJumpMode(): void {
    this.repository.disabeJumpMode();
  }
}
