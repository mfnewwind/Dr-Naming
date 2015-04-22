'use strict';
/*jslint node: true */

var Path = require('path');
var assert = require('assert');
var _ = require('lodash');

var ParserClasses = {
  js: require('js-parser'),
  pl: require('./perl-parser')
};

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

module.exports = {
  parseFile: parseFile
};