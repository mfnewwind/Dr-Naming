'use strict';
/*jslint node: true */

var Path = require('path');
var assert = require('assert');
var _ = require('lodash');

var FileQueue = require('./file-queue');
var save = require('./parser-result/saver');
var gh = require('./github');

/**
 * パーサーのクラス一覧
 * 言語名 -> クラスの連想配列
 */
var ParserClasses = {
  js: require('js-parser'),
  pl: require('./perl-parser'),
  java: require('./java-parser'),
};

/**
 * 言語別のパーサーインスタンスを取得する
 * @param   lang 言語名 (略記)
 * @returns パーサーのインスタンス
 */
var getParser = _.memoize(function (lang) {
  
  if (!(lang in ParserClasses)) {
    console.error('Can\'t find parser for lang = ' + lang);
    return null;
  }
  
  return new ParserClasses[lang]();
});

/**
 * ファイルの処理キューを取得する
 */
var getFileQueue = _.memoize(function () {
  var q = new FileQueue();
  
  // パース処理
  q.on('parse', function (file) {
    var options = file.options || {};
    parseFile(file.local_path, file.lang, options, function (err, results) {
      // ファイルキューに対してパースが終了したことを通知
        q.emit('parsed', err, file, results);
    });
  });
  
  return q;
});

/**
 * 処理するファイルを追加する
 */
function enqueueFile(file) {
  assert(file);
  getFileQueue().enqueue(file);
}

/**
 * 処理するレポジトリを追加する
 */
function enqueueRepo(repo_name, cb) {
  var q = getFileQueue();
  var opt = splitRepoName(repo_name);
  var repo = gh.getRepo(opt.owner, opt.repo);
  var files = gh.getRepoFiles(opt.owner, opt.repo); // ファイルの配列が帰ってくると仮定
  var results = []; // 結果の配列
  var runs = 0;
  
  q.on('parsed', function F(err, file, results) {
    // 違うコミットのファイルは処理しない
    if (!_.find(files, file)) { return; }
    
    // 結果を格納
    results.push([ err, file, results ]);
    
    // 最後のファイルか判定
    if (++runs === files.length) {
      // 最後のファイル
      storeDatabase(repo, repo.default_branch, results);
      
      // イベントを外す
      q.removeListener('parsed', F);
    }
  });
}

/**
 * データベースにパース結果を格納する
 */
function storeDatabase(repo_name, branch_name, results) {
  save(repo_name, branch_name, results);
}

/**
 * レポジトリ名をユーザー名とブランチ名に分解する
 */
function splitRepoName(repo_name) {
  return {
    owner: repo_name.split('/')[0],
    repo: repo_name.split('/')[1]
  };
}


/**
 * ファイル単位でパース処理を行う
 * @param path    パースするファイルのパス
 * @param lang    パース対象の言語
 * @param options パーサーへのオプション (省略可)
 * @param cb      コールバック関数
 *                引数: err: エラー, result: パース結果
 */
function parseFile(path, lang, options, cb) {
  if (typeof options === 'function') {
    cb = options;
    options = {};
  }
  
  var parser = getParser(lang);
  parser.parseFile(path, options, cb);
}

module.exports = {
  parseFile: parseFile,
  getFileQueue: getFileQueue,
  enqueueFile: enqueueFile,
  enqueueRepo: enqueueRepo
};