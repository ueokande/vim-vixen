import { injectable } from "tsyringe";
import FindRepository from "../repositories/FindRepository";

@injectable()
export default class FindUseCase {
  constructor(private readonly findRepository: FindRepository) {}

  getKeyword(): Promise<string> {
    return this.findRepository.getKeyword();
  }

  setKeyword(keyword: string): Promise<any> {
    return this.findRepository.setKeyword(keyword);
  }
}
