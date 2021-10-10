import SettingData, {
  FormKeymaps,
  JSONTextSettings,
  FormSettings,
} from "../../src/shared/SettingData";
import Settings from "../../src/shared/settings/Settings";
import Keymaps from "../../src/shared/settings/Keymaps";
import ColorScheme from "../../src/shared/ColorScheme";

describe("shared/SettingData", () => {
  describe("FormKeymaps", () => {
    describe("#valueOF to #toKeymaps", () => {
      it("parses form keymaps and convert to operations", () => {
        const data = {
          'scroll.vertically?{"count":1}': "j",
          "scroll.home": "0",
        };

        const keymaps = FormKeymaps.fromJSON(data).toKeymaps().toJSON();
        expect(keymaps).toEqual({
          j: { type: "scroll.vertically", count: 1 },
          "0": { type: "scroll.home" },
        });
      });
    });

    describe("#fromKeymaps to #toJSON", () => {
      it("create from a Keymaps and create a JSON object", () => {
        const keymaps: Keymaps = Keymaps.fromJSON({
          j: { type: "scroll.vertically", count: 1 },
          "0": { type: "scroll.home" },
        });

        const form = FormKeymaps.fromKeymaps(keymaps).toJSON();
        expect(form).toEqual({
          'scroll.vertically?{"count":1}': "j",
          "scroll.home": "0",
        });
      });
    });
  });

  describe("JSONSettings", () => {
    describe("#valueOf to #toSettings", () => {
      it("parse object and create a Settings", () => {
        const o = `{
          "keymaps": {},
          "search": {
            "default": "google",
            "engines": {
              "google": "https://google.com/search?q={}"
            }
          },
          "properties": {
            "hintchars": "abcdefghijklmnopqrstuvwxyz",
            "smoothscroll": false,
            "complete": "sbh",
            "colorscheme": "system"
          },
          "blacklist": []
        }`;

        const settings = JSONTextSettings.fromText(o).toSettings();
        expect(settings.toJSON()).toEqual(JSON.parse(o));
      });
    });

    describe("#fromSettings to #toJSON", () => {
      it("create from a Settings and create a JSON string", () => {
        const o = Settings.fromJSON({
          keymaps: {},
          search: {
            default: "google",
            engines: {
              google: "https://google.com/search?q={}",
            },
          },
          properties: {
            hintchars: "abcdefghijklmnopqrstuvwxyz",
            smoothscroll: false,
            complete: "sbh",
          },
          blacklist: [],
        });

        const json = JSONTextSettings.fromSettings(o).toJSONText();
        expect(JSON.parse(json)).toEqual(o.toJSON());
      });
    });
  });

  describe("FormSettings", () => {
    describe("#valueOf to #toSettings", () => {
      it("parse object and create a Settings", () => {
        const data = {
          keymaps: {
            'scroll.vertically?{"count":1}': "j",
            "scroll.home": "0",
          },
          search: {
            default: "google",
            engines: [["google", "https://google.com/search?q={}"]],
          },
          properties: {
            hintchars: "abcdefghijklmnopqrstuvwxyz",
            smoothscroll: false,
            complete: "sbh",
            colorscheme: ColorScheme.System,
          },
          blacklist: [],
        };

        const settings = FormSettings.fromJSON(data).toSettings();
        expect(settings.toJSON()).toEqual({
          keymaps: {
            j: { type: "scroll.vertically", count: 1 },
            "0": { type: "scroll.home" },
          },
          search: {
            default: "google",
            engines: {
              google: "https://google.com/search?q={}",
            },
          },
          properties: {
            hintchars: "abcdefghijklmnopqrstuvwxyz",
            smoothscroll: false,
            complete: "sbh",
            colorscheme: "system",
          },
          blacklist: [],
        });
      });
    });

    describe("#fromSettings to #toJSON", () => {
      it("create from a Settings and create a JSON string", () => {
        const data: Settings = Settings.fromJSON({
          keymaps: {
            j: { type: "scroll.vertically", count: 1 },
            "0": { type: "scroll.home" },
          },
          search: {
            default: "google",
            engines: {
              google: "https://google.com/search?q={}",
            },
          },
          properties: {
            hintchars: "abcdefghijklmnopqrstuvwxyz",
            smoothscroll: false,
            complete: "sbh",
            colorscheme: ColorScheme.System,
          },
          blacklist: [],
        });

        const json = FormSettings.fromSettings(data).toJSON();
        expect(json).toEqual({
          keymaps: {
            'scroll.vertically?{"count":1}': "j",
            "scroll.home": "0",
          },
          search: {
            default: "google",
            engines: [["google", "https://google.com/search?q={}"]],
          },
          properties: {
            hintchars: "abcdefghijklmnopqrstuvwxyz",
            smoothscroll: false,
            complete: "sbh",
            colorscheme: "system",
          },
          blacklist: [],
        });
      });
    });
  });

  describe("SettingData", () => {
    describe("#valueOf to #toJSON", () => {
      it("parse object from json source", () => {
        const data = {
          source: "json",
          json: `{
            "keymaps": {},
            "search": {
              "default": "google",
              "engines": {
                "google": "https://google.com/search?q={}"
              }
            },
            "properties": {
              "hintchars": "abcdefghijklmnopqrstuvwxyz",
              "smoothscroll": false,
              "complete": "sbh",
              "colorscheme": "system"
            },
            "blacklist": []
          }`,
        };

        const j = SettingData.fromJSON(data).toJSON();
        expect(j.source).toEqual("json");
        expect(typeof j.json).toEqual("string");
      });

      it("parse object from form source", () => {
        const data = {
          source: "form",
          form: {
            keymaps: {},
            search: {
              default: "yahoo",
              engines: [["yahoo", "https://yahoo.com/search?q={}"]],
            },
            properties: {
              hintchars: "abcdefghijklmnopqrstuvwxyz",
              smoothscroll: false,
              complete: "sbh",
              colorscheme: ColorScheme.System,
            },
            blacklist: [],
          },
        };

        const j = SettingData.fromJSON(data).toJSON();
        expect(j.source).toEqual("form");
        expect(j.form).toEqual({
          keymaps: {},
          search: {
            default: "yahoo",
            engines: [["yahoo", "https://yahoo.com/search?q={}"]],
          },
          properties: {
            hintchars: "abcdefghijklmnopqrstuvwxyz",
            smoothscroll: false,
            complete: "sbh",
            colorscheme: "system",
          },
          blacklist: [],
        });
      });
    });

    describe("#toSettings", () => {
      it("parse object from json source", () => {
        const data = {
          source: "json",
          json: `{
            "keymaps": {},
            "search": {
              "default": "google",
              "engines": {
                "google": "https://google.com/search?q={}"
              }
            },
            "properties": {
              "hintchars": "abcdefghijklmnopqrstuvwxyz",
              "smoothscroll": false,
              "complete": "sbh"
            },
            "blacklist": []
          }`,
        };

        const settings = SettingData.fromJSON(data).toSettings();
        expect(settings.search.defaultEngine).toEqual("google");
      });

      it("parse object from form source", () => {
        const data = {
          source: "form",
          form: {
            keymaps: {},
            search: {
              default: "yahoo",
              engines: [["yahoo", "https://yahoo.com/search?q={}"]],
            },
            properties: {
              hintchars: "abcdefghijklmnopqrstuvwxyz",
              smoothscroll: false,
              complete: "sbh",
            },
            blacklist: [],
          },
        };

        const settings = SettingData.fromJSON(data).toSettings();
        expect(settings.search.defaultEngine).toEqual("yahoo");
      });
    });
  });
});
