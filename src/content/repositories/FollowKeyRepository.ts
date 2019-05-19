export default interface FollowKeyRepository {
  getKeys(): string[];

  pushKey(key: string): void;

  popKey(): void;

  clearKeys(): void;

  // eslint-disable-next-line semi
}

const current: {
  keys: string[];
} = {
  keys: [],
};

export class FollowKeyRepositoryImpl implements FollowKeyRepository {
  getKeys(): string[] {
    return current.keys;
  }

  pushKey(key: string): void {
    current.keys.push(key);
  }

  popKey(): void {
    current.keys.pop();
  }

  clearKeys(): void {
    current.keys = [];
  }
}
