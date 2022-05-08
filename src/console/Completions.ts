type Completions = {
  readonly name: string;
  readonly items: {
    readonly primary?: string;
    readonly secondary?: string;
    readonly value?: string;
    readonly icon?: string;
  }[];
}[];

export default Completions;
