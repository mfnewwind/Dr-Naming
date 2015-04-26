'use strict';
/*jslint node: true */

var Path = require('path');
var _ = require('lodash');

var Repo = require('../../models/repo');
var util = require('./util');


/**
 * 解析結果を保存する
 */
function save(repo_name, branch_name, results, cb) {
  if (results.length === 0) {
    return;
  }
  
  // レポジトリとブランチを取得する
  findOrCreateRepoAndBranch(repo_name, branch_name, function (err, repo, branch) {
    if (err) { return cb(err); }
    
    var newFiles = [];
    
    _.each(results, function (x) {
      var err = x[0];
      var file = x[1];
      var result = x[2];

      var status = err ? 'fail' : 'success';

      // エラー発生時はエラーを格納
      result = err ? err.toString() : result;
      

      var newFile = {
        file_name: Path.basename(file.path),
        path: file.path,
        url: file.url,
        status: status,
        result: result
      };

      newFiles.push(newFile);
    });
    

    console.log('Saving in DB: ' + newFiles.length + ' files');
    
    _.each(branch.files, function (file) {
      branch.files.remove(file._id);
    });
    
    _.each(newFiles, function (file) {
      branch.files.push(file);
    });
        
    repo.save(function (err) {
      console.log('Saved', repo);
      
      if (err) { return cb(err); }
      cb(err, repo, branch, newFiles);
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
    branch = { branch_name: branch_name, files: [] };
    repo.branches.push(branch);
  }
  
  return _.find(repo.branches, function (x) { return x.branch_name === branch_name; });
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
    
    if (!(branch.files)) { branch.files = []; }
    
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