'use strict';
/*jslint node: true */


var _ = require('lodash');

var Repo = require('../../models/repo');
var util = require('./util');


/**
 * 解析結果を取得する
 * @param repo_name   レポジトリ名 (例: github.com/user/repo)
 * @param branch_name ブランチ名 (例: master)
 * @param cb          コールバック関数 (引数: err, repo, branch, files)
 */
function load(repo_name, branch_name, cb) {
  util.findRepository(repo_name, function (err, repo) {
    if (err) { return cb(err); }
    if (!repo) { return cb('Can\'t find repository `' + repo_name + '`'); }
    
    util.findBranch(repo, branch_name, function (err, branch) {
      if (err) { return cb(err); }
      if (!branch) { return cb('Can\'t find branch `' + branch_name + '`'); }
      
      cb(null, repo, branch, branch.files);
    });
  });
}

module.exports = load;