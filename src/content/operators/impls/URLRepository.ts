export default interface URLRepository {
  getCurrentURL(): string;
}

export class URLRepositoryImpl implements URLRepository {
  getCurrentURL(): string {
    return window.location.href;
  }
}
