import { injectable } from "tsyringe";
import FindUseCase from "../usecases/FindUseCase";

@injectable()
export default class FindController {
  constructor(private findUseCase: FindUseCase) {}

  getKeyword(): Promise<string> {
    return this.findUseCase.getKeyword();
  }

  setKeyword(keyword: string): Promise<any> {
    return this.findUseCase.setKeyword(keyword);
  }
}
