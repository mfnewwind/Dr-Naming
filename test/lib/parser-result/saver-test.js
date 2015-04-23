'use strict';

/*jslint node: true */
/*jslint -W030 */
/*globals describe, it, before */

var Path = require('path');

var Repo = require('../../../models/repo');
var save = require('../../../lib/parser-result/saver');

var EXAMPLE_JS = Path.resolve(__dirname, '../../files/example.js');


describe('Unit test for lib/parser-result/saver.js', function () {
  describe('save', function () {
    var repo_name = 'github.com/user/repo';
    var file = {
      path: '/example.js',
      local_path: EXAMPLE_JS,
      lang: 'js',
      repo: repo_name,
      branch: 'master'
    };
    
    var repo;
    
    before(function (done) {
      repo = new Repo({ repo_name: repo_name });
      repo.save(done);
    });
    
    it('should save result', function (done) {
      save(null, file, [], function (err, repo, branch, newFile) {
        console.log(err, repo, branch, newFile);
        done();
      });
    });
  });
});