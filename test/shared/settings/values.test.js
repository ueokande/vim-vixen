import { expect } from 'chai';
import * as values from 'shared/settings/values';

describe("settings values", () => {
  describe('valueFromJson', () => {
    it('return object from json string', () => {
      let json = `{
        "keymaps": { "0": {"type": "scroll.home"}},
        "search": { "default": "google", "engines": { "google": "https://google.com/search?q={}" }},
        "blacklist": [ "*.slack.com"],
        "properties": {
          "mystr": "value",
          "mynum": 123,
          "mybool": true
        }
      }`;
      let value = values.valueFromJson(json);

      expect(value.keymaps).to.deep.equal({ 0: {type: "scroll.home"}});
      expect(value.search).to.deep.equal({ default: "google", engines: { google: "https://google.com/search?q={}"} });
      expect(value.blacklist).to.deep.equal(["*.slack.com"]);
      expect(value.properties).to.have.property('mystr', 'value');
      expect(value.properties).to.have.property('mynum', 123);
      expect(value.properties).to.have.property('mybool', true);
    });
  });

  describe('valueFromForm', () => {
    it('returns value from form', () => {
      let form = {
        keymaps: {
          'scroll.vertically?{"count":1}': 'j',
          'scroll.home': '0',
        },
        search: {
          default: 'google',
          engines: [['google', 'https://google.com/search?q={}']],
        },
        blacklist: ['*.slack.com'],
        "properties": {
          "mystr": "value",
          "mynum": 123,
          "mybool": true,
        }
      };
      let value = values.valueFromForm(form);

      expect(value.keymaps).to.have.deep.property('j', { type: "scroll.vertically", count: 1 });
      expect(value.keymaps).to.have.deep.property('0', { type: "scroll.home" });
      expect(JSON.stringify(value.search)).to.deep.equal(JSON.stringify({ default: "google", engines: { google: "https://google.com/search?q={}"} }));
      expect(value.search).to.deep.equal({ default: "google", engines: { google: "https://google.com/search?q={}"} });
      expect(value.blacklist).to.deep.equal(["*.slack.com"]);
      expect(value.properties).to.have.property('mystr', 'value');
      expect(value.properties).to.have.property('mynum', 123);
      expect(value.properties).to.have.property('mybool', true);
    });

    it('convert from empty form', () => {
      let form = {};
      let value = values.valueFromForm(form);
      expect(value).to.not.have.key('keymaps');
      expect(value).to.not.have.key('search');
      expect(value).to.not.have.key('blacklist');
      expect(value).to.not.have.key('properties');
    });

    it('override keymaps', () => {
      let form = {
        keymaps: {
          'scroll.vertically?{"count":1}': 'j',
          'scroll.vertically?{"count":-1}': 'j',
        }
      };
      let value = values.valueFromForm(form);

      expect(value.keymaps).to.have.key('j');
    });

    it('override search engine', () => {
      let form = {
        search: {
          default: 'google',
          engines: [
            ['google', 'https://google.com/search?q={}'],
            ['google', 'https://google.co.jp/search?q={}'],
          ]
        }
      };
      let value = values.valueFromForm(form);

      expect(value.search.engines).to.have.property('google', 'https://google.co.jp/search?q={}');
    });
  });

  describe('jsonFromValue', () => {
  });

  describe('formFromValue', () => {
    it('convert empty value to form', () => {
      let value = {};
      let form = values.formFromValue(value);

      expect(value).to.not.have.key('keymaps');
      expect(value).to.not.have.key('search');
      expect(value).to.not.have.key('blacklist');
    });

    it('convert value to form', () => {
      let value = {
        keymaps: {
          j: { type: 'scroll.vertically', count: 1 },
          JJ: { type: 'scroll.vertically', count: 100 },
          0: { type: 'scroll.home' },
        },
        search: { default: 'google', engines: { google: 'https://google.com/search?q={}' }},
        blacklist: [ '*.slack.com'],
        properties: {
          "mystr": "value",
          "mynum": 123,
          "mybool": true,
        }
      };
      let allowed = ['scroll.vertically?{"count":1}', 'scroll.home' ];
      let form = values.formFromValue(value, allowed);

      expect(form.keymaps).to.have.property('scroll.vertically?{"count":1}', 'j');
      expect(form.keymaps).to.not.have.property('scroll.vertically?{"count":100}');
      expect(form.keymaps).to.have.property('scroll.home', '0');
      expect(Object.keys(form.keymaps)).to.have.lengthOf(2);
      expect(form.search).to.have.property('default', 'google');
      expect(form.search).to.have.deep.property('engines', [['google', 'https://google.com/search?q={}']]);
      expect(form.blacklist).to.have.lengthOf(1);
      expect(form.blacklist).to.include('*.slack.com');
      expect(form.properties).to.have.property('mystr', 'value');
      expect(form.properties).to.have.property('mynum', 123);
      expect(form.properties).to.have.property('mybool', true);
    });
  });
});
