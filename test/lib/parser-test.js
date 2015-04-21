'use strict';

/*jslint node: true */
/*jslint -W030 */
/*globals describe, it */

var Path = require('path');

var _ = require('lodash');
var expect = require('chai').expect;

var parser = require('../../lib/parser');

var EXAMPLE_JS = Path.resolve(__dirname, '../files/example.js');


describe('Unit test for lib/parser.js', function () {
  describe('parseFile', function () {
    it('should parse a JavaScript file', function (done) {
      parser.parseFile(EXAMPLE_JS, 'js', function (err, results) {
        try {
          expect(err).to.be.null;
          expect(results).to.be.an('array');

          var var_message = _.find(results, function (x) { return x.name === 'message'; });
          var func_testFunc = _.find(results, function (x) { return x.name === 'testFunc'; });

          expect(var_message).to.deep.equal({
            type: 'variable',
            name: 'message',
            class_name: '',
            comment: '',
            line: 4
          });
          
          expect(func_testFunc).to.deep.equal({
            type: 'function',
            name: 'testFunc',
            class_name: '',
            comment: '',
            line: 7
          });
          
          done();
        }
        
        catch (e) {
          console.log(results);
          done(e);
        }
      });
    });
  });
});
