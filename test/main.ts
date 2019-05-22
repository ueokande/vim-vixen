import 'reflect-metadata';
import { expect } from 'chai';

const browserFake = require('webextensions-api-fake');
const browser = browserFake();

global.expect = expect;
global.browser = browser;
