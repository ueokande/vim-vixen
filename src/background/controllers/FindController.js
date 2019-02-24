import FindUseCase from '../usecases/FindUseCase';

export default class FindController {
  constructor() {
    this.findUseCase = new FindUseCase();
  }

  getKeyword() {
    return this.findUseCase.getKeyword();
  }

  setKeyword(keyword) {
    return this.findUseCase.setKeyword(keyword);
  }
}
