export type Type = string | number | boolean;

export class Def {
  private name0: string;

  private description0: string;

  private defaultValue0: Type;

  constructor(
    name: string,
    description: string,
    defaultValue: Type,
  ) {
    this.name0 = name;
    this.description0 = description;
    this.defaultValue0 = defaultValue;
  }

  public get name(): string {
    return this.name0;
  }

  public get defaultValue(): Type {
    return this.defaultValue0;
  }

  public get description(): Type {
    return this.description0;
  }

  public get type(): string {
    return typeof this.defaultValue;
  }
}

export const defs: Def[] = [
  new Def(
    'hintchars',
    'hint characters on follow mode',
    'abcdefghijklmnopqrstuvwxyz'),
  new Def(
    'smoothscroll',
    'smooth scroll',
    false),
  new Def(
    'complete',
    'which are completed at the open page',
    'sbh'),
];

export const defaultValues = {
  hintchars: 'abcdefghijklmnopqrstuvwxyz',
  smoothscroll: false,
  complete: 'sbh',
};
