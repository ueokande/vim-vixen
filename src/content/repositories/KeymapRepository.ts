import { Key } from '../../shared/utils/keys';

export default interface KeymapRepository {
  enqueueKey(key: Key): Key[];

  clear(): void;

  // eslint-disable-next-line semi
}

let current: Key[] = [];

export class KeymapRepositoryImpl {

  enqueueKey(key: Key): Key[] {
    current.push(key);
    return current;
  }

  clear(): void {
    current = [];
  }
}
