import ColorScheme from "../ColorScheme";

export type PropertiesJSON = {
  hintchars?: string;
  smoothscroll?: boolean;
  complete?: string;
  colorscheme?: ColorScheme;
  searchOnlyCurrentWin?: boolean;
};

export type PropertyTypes = {
  hintchars: string;
  smoothscroll: string;
  complete: string;
  colorscheme: string;
  searchOnlyCurrentWin: string;
};

type PropertyName = "hintchars" | "smoothscroll" | "complete" | "colorscheme" | "searchOnlyCurrentWin";

type PropertyDef = {
  name: PropertyName;
  defaultValue: string | number | boolean;
  type: "string" | "number" | "boolean";
};

const defs: PropertyDef[] = [
  {
    name: "hintchars",
    defaultValue: "abcdefghijklmnopqrstuvwxyz",
    type: "string",
  },
  {
    name: "smoothscroll",
    defaultValue: false,
    type: "boolean",
  },
  {
    name: "complete",
    defaultValue: "sbh",
    type: "string",
  },
  {
    name: "colorscheme",
    defaultValue: ColorScheme.System,
    type: "string",
  },
  {
    name: "searchOnlyCurrentWin",
    defaultValue: true,
    type: "boolean",
  },
];

const defaultValues = {
  hintchars: "abcdefghijklmnopqrstuvwxyz",
  smoothscroll: false,
  complete: "sbh",
  colorscheme: ColorScheme.System,
  searchOnlyCurrentWin: false,
};

export default class Properties {
  public hintchars: string;

  public smoothscroll: boolean;

  public complete: string;

  public colorscheme: ColorScheme;

  public searchOnlyCurrentWin: boolean;

  constructor({
    hintchars,
    smoothscroll,
    complete,
    colorscheme,
    searchOnlyCurrentWin,
  }: {
    hintchars?: string;
    smoothscroll?: boolean;
    complete?: string;
    colorscheme?: ColorScheme;
    searchOnlyCurrentWin?: boolean;
  } = {}) {
    this.hintchars = hintchars || defaultValues.hintchars;
    this.smoothscroll = smoothscroll || defaultValues.smoothscroll;
    this.complete = complete || defaultValues.complete;
    this.colorscheme = colorscheme || defaultValues.colorscheme;
    this.searchOnlyCurrentWin = searchOnlyCurrentWin || defaultValues.searchOnlyCurrentWin;
  }

  static fromJSON(json: PropertiesJSON): Properties {
    return new Properties(json);
  }

  static types(): PropertyTypes {
    return {
      hintchars: "string",
      smoothscroll: "boolean",
      complete: "string",
      colorscheme: "string",
      searchOnlyCurrentWin: "boolean",
    };
  }

  static def(name: string): PropertyDef | undefined {
    return defs.find((p) => p.name === name);
  }

  static defs(): PropertyDef[] {
    return defs;
  }

  toJSON(): PropertiesJSON {
    return {
      hintchars: this.hintchars,
      smoothscroll: this.smoothscroll,
      complete: this.complete,
      colorscheme: this.colorscheme,
      searchOnlyCurrentWin: this.searchOnlyCurrentWin,
    };
  }
}
