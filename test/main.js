import chai from 'chai';
const browserFake = require('webextensions-api-fake');
const browser = browserFake();

global.expect = chai.expect;
global.browser = browser;
