export default interface FindRepository {
  getLastKeyword(): string | null;

  setLastKeyword(keyword: string): void;

  // eslint-disable-next-line semi
}

let current: string | null = null;

export class FindRepositoryImpl implements FindRepository {
  getLastKeyword(): string | null {
    return current;
  }

  setLastKeyword(keyword: string): void {
    current = keyword;
  }
}
