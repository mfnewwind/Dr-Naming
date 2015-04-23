'use strict';
/*jslint node: true */

var Path = require('path');
var assert = require('assert');
var _ = require('lodash');

var FileQueue = require('./file-queue');

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
    parseFile(file.path, file.lang, options, function (err, results) {
      // データベースに登録する
      storeDatabase(err, file, results);
      
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
 * データベースにパース結果を格納する
 */
function storeDatabase(err, file, results) {
  console.log(err, file, results);
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
  enqueueFile: enqueueFile
};