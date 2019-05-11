import FindUseCase from '../usecases/FindUseCase';

export default class FindController {
  private findUseCase: FindUseCase;

  constructor() {
    this.findUseCase = new FindUseCase();
  }

  getKeyword(): Promise<string> {
    return this.findUseCase.getKeyword();
  }

  setKeyword(keyword: string): Promise<any> {
    return this.findUseCase.setKeyword(keyword);
  }
}
