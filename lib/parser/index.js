'use strict';
/*jslint node: true */

var Path = require('path');
var _ = require('lodash');

var JsParser = require('js-parser');
//var plPerser = require('./perl');

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
    options = { };
  }
  
  return cb('Not implemented');
}

module.exports = {
  parseFile: parseFile
};