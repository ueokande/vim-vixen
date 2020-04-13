import "reflect-metadata";
import { expect } from "chai";
import browserFake from "webextensions-api-fake";

global.expect = expect;
global.browser = browserFake();
