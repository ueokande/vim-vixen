import FindRepository from '../repositories/find';

export default class FindInteractor {
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
