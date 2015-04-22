'use strict';

/*jslint node: true */
/*jslint -W030 */
/*globals describe, it */

var Path = require('path');
var _ = require('lodash');
var expect = require('chai').expect;

var FileQueue = require('../../lib/file-queue');


describe('Unit test for lib/file-queue.js', function () {
  describe('#constructor', function () {
    it('shoud not throw some errors', function () {
      expect(function () { new FileQueue(); }).to.not.throws();
    });
  });
});
