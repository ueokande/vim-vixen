import Search from "../../../src/shared/settings/Search";

describe("Search", () => {
  it("returns search settings by valid settings", () => {
    const search = Search.fromJSON({
      default: "google",
      engines: {
        google: "https://google.com/search?q={}",
        yahoo: "https://search.yahoo.com/search?p={}",
      },
    });

    expect(search.defaultEngine).toEqual("google");
    expect(search.engines).toEqual({
      google: "https://google.com/search?q={}",
      yahoo: "https://search.yahoo.com/search?p={}",
    });
    expect(search.toJSON()).toEqual({
      default: "google",
      engines: {
        google: "https://google.com/search?q={}",
        yahoo: "https://search.yahoo.com/search?p={}",
      },
    });
  });

  it("throws a TypeError by invalid settings", () => {
    expect(() =>
      Search.fromJSON({
        default: "wikipedia",
        engines: {
          google: "https://google.com/search?q={}",
          yahoo: "https://search.yahoo.com/search?p={}",
        },
      })
    ).toThrow(TypeError);
    expect(() =>
      Search.fromJSON({
        default: "g o o g l e",
        engines: {
          "g o o g l e": "https://google.com/search?q={}",
        },
      })
    ).toThrow(TypeError);
    expect(() =>
      Search.fromJSON({
        default: "google",
        engines: {
          google: "https://google.com/search",
        },
      })
    ).toThrow(TypeError);
    expect(() =>
      Search.fromJSON({
        default: "google",
        engines: {
          google: "https://google.com/search?q={}&r={}",
        },
      })
    ).toThrow(TypeError);
  });
});
