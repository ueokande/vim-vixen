import URLRepository from "../../../src/content/operators/impls/URLRepository";

export default class MockURLRepository implements URLRepository {
  constructor(private url: string = "https://example.com/") {}

  getCurrentURL(): string {
    return this.url;
  }
}
