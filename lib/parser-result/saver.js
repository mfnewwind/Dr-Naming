'use strict';
/*jslint node: true */

var Path = require('path');
var _ = require('lodash');

var Repo = require('../../models/repo');
var util = require('./util');


/**
 * 解析結果を保存する
 */
function save(err, file, result, cb) {
  var status = err ? 'fail' : 'success';
  
  // エラー発生時はエラーを格納
  result = err ? err.toString() : result;
  
  // レポジトリとブランチを取得する
  findOrCreateRepoAndBranch(file.repo, file.branch, function (err, repo, branch) {
    if (err) { return cb(err); }
    
    var savedFile = findFileByBranch(branch, file.path);
    
    if (savedFile) {
      savedFile.status = file.status;
      savedFile.result = file.result;
    }
    
    else {
      // 結果を格納
      var newFile = {
        file_name: Path.basename(file.path),
        path: file.path,
        url: file.url,
        status: status,
        result: result
      };

      branch.files.push(newFile);
    }
    
    repo.save(function (err) {
      if (err) { return cb(err); }
      cb(err, repo, branch, newFile);
    });
  });
}



/**
 * ブランチを取得する
 * なければブランチを新規に作成する
 */
function findOrCreateBranch(repo, branch_name) {
  if (!repo) { return null; }
  
  var branch = util.findBranch(repo, branch_name);
  
  if (!branch) {
    branch = { branch_name: branch_name };
    repo.branches.push(branch);
  }
  
  return branch;
}

/**
 * レポジトリとブランチを取得する
 * ブランチがなければ新規に作成する
 */
function findOrCreateRepoAndBranch(repo_name, branch_name, cb) {
  util.findRepository(repo_name, function (err, repo) {
    if (err) { return cb(err); }
    
    // 解析が始まっているということは、レポジトリは登録されているはず
    if (!repo) { return cb('Can\'t find repository `' + repo_name + '`'); }
    
    // ブランチを取得
    var branch = findOrCreateBranch(repo, branch_name);
    
    // ブランチが取得できないのはおかしい
    if (!branch) { return cb('Can\'t find and create branch `' + branch_name + '`'); }
    
    if (!branch.files) {
      branch.files = [];
    }
    
    cb(null, repo, branch);
  });
}

/**
 * ファイルをブランチより取得する
 */
function findFileByBranch(branch, path) {
  return _.find(branch.files, function (file) {
    return file.path === path;
  });
}


module.exports = save;