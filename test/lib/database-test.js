'use strict';

/*jslint node: true */
/*jslint -W030 */
/*globals describe, it */

var Path = require('path');

var _ = require('lodash');
var expect = require('chai').expect;

var database;

describe('Unit test for lib/database.js', function () {
  describe('require database', function () {
    it('Can I connect to database?', function (done) {
      try {
        database = require('../../lib/database');
        done();
      } catch(e) {
        console.error(e);
        done(e);
      }
    });

  });
});
