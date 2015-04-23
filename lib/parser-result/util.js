'use strict';
/*jslint node: true */

var _ = require('lodash');
var Repo = require('../models/repo');


/**
 * レポジトリを取得する
 */
function findRepository(repo_name, cb) {
  Repo.findOne({ repo_name: repo_name }, cb);
}

/**
 * ブランチを取得する
 */
function findBranch(repo, branch_name) {
  if (!repo) { return null; }
  
  return _.find(repo.branches, function (branch) {
    return branch.branch_name == branch_name;
  });
}

module.exports = {
  findRepository: findRepository,
  findBranch: findBranch
};