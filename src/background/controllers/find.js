import FindInteractor from '../usecases/find';

export default class FindController {
  constructor() {
    this.findInteractor = new FindInteractor();
  }

  getKeyword() {
    return this.findInteractor.getKeyword();
  }

  setKeyword(keyword) {
    return this.findInteractor.setKeyword(keyword);
  }
}
