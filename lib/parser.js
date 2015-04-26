'use strict';
/*jslint node: true */

var Path = require('path');
var assert = require('assert');
var _ = require('lodash');

var FileQueue = require('./file-queue');
var save = require('./parser-result/saver');
var github = require('./github');

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
 * 拡張子と言語名の対応表
 */
var LanguageNames = {
  '.js': 'js',
  '.pl': 'pl',
  '.pm': 'pl',
  '.java': 'java'
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
function enqueueRepo(token, repo_name, cb) {
  var q = getFileQueue();
  var opt = splitRepoName(repo_name);
  var gh = github.getGitHubInstance(token);
  
  console.log('Enqueue repository: ' + repo_name);
  
  github.getRepo(gh, opt.owner, opt.repo, function (err, repo) {
    if (err) { return cb(err); }
    
    github.getRepoFiles(gh, opt.owner, opt.repo, function (err, files) {
      if (err) { return cb(err); }
      
      var results = []; // 結果の配列
      var runs = 0;
      var enableLength = 0;

      _.each(files, function (file) {
        var lang = covertFileNameToLangName(file.path);

        if (lang) {
          ++enableLength;
          file.lang = lang;
          enqueueFile(file);
        }
      });

      q.on('parsed', function F(err, file, r) {
        // 違うコミットのファイルは処理しない
        if (!_.find(files, file)) { return; }

        // 結果を格納
        results.push([ err, file, r ]);

        // 最後のファイルか判定
        console.log('Parsing file: ' + (runs + 1) + '/' + enableLength);
        
        if (++runs === enableLength) {
          console.log('Finished parsing: ' + repo_name);
          
          // イベントを外す
          q.removeListener('parsed', F);
          
          // 最後のファイル
          storeDatabase(repo_name, repo.default_branch, results, function (err) {
            // コールバック関数が指定されている場合、処理
            if (cb) { return cb(err, repo, results); }
          });
        }
      });
    });
  });
}

/**
 * データベースにパース結果を格納する
 */
function storeDatabase(repo_name, branch_name, results, cb) {
  save(repo_name, branch_name, results, cb);
}

/**
 * レポジトリ名をユーザー名とブランチ名に分解する
 */
function splitRepoName(repo_name) {
  var names = repo_name.split('/');
  
  return {
    owner: names[names.length - 2],
    repo: names[names.length - 1]
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

/**
 * ファイル名をパーサーで利用する言語名に変換する
 */
function covertFileNameToLangName(filename) {
  var extname = Path.extname(filename);
  return LanguageNames[extname];
}


module.exports = {
  parseFile: parseFile,
  getFileQueue: getFileQueue,
  enqueueFile: enqueueFile,
  enqueueRepo: enqueueRepo,
  covertFileNameToLangName: covertFileNameToLangName
};