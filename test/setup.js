require('babel-register');

//loading test modules
chai = require('chai');
sinon = require('sinon');

//configure chai
chai.config.includeStack = true;
sinon.assert.expose(chai.assert, { prefix: '' });

assert = chai.assert;