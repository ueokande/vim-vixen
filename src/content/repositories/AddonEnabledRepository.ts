let enabled: boolean = false;

export default interface AddonEnabledRepository {
  set(on: boolean): void;

  get(): boolean;

  // eslint-disable-next-line semi
}

export class AddonEnabledRepositoryImpl implements AddonEnabledRepository {
  set(on: boolean): void {
    enabled = on;
  }

  get(): boolean {
    return enabled;
  }
}
