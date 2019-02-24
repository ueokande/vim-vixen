import FindRepository from '../repositories/FindRepository';

export default class FindUseCase {
  constructor() {
    this.findRepository = new FindRepository();
  }

  getKeyword() {
    return this.findRepository.getKeyword();
  }

  setKeyword(keyword) {
    return this.findRepository.setKeyword(keyword);
  }
}
