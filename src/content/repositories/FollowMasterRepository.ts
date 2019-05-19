export default interface FollowMasterRepository {
  setCurrentFollowMode(newTab: boolean, background: boolean): void;

  getTags(): string[];

  getTagsByPrefix(prefix: string): string[];

  addTag(tag: string): void;

  clearTags(): void;

  getCurrentNewTabMode(): boolean;

  getCurrentBackgroundMode(): boolean;

  // eslint-disable-next-line semi
}

const current: {
  newTab: boolean;
  background: boolean;
  tags: string[];
} = {
  newTab: false,
  background: false,
  tags: [],
};

export class FollowMasterRepositoryImpl implements FollowMasterRepository {
  setCurrentFollowMode(newTab: boolean, background: boolean): void {
    current.newTab = newTab;
    current.background = background;
  }

  getTags(): string[] {
    return current.tags;
  }

  getTagsByPrefix(prefix: string): string[] {
    return current.tags.filter(t => t.startsWith(prefix));
  }

  addTag(tag: string): void {
    current.tags.push(tag);
  }

  clearTags(): void {
    current.tags = [];
  }

  getCurrentNewTabMode(): boolean {
    return current.newTab;
  }

  getCurrentBackgroundMode(): boolean {
    return current.background;
  }
}

