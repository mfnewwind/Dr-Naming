'use strict';
/*jslint node: true */

var Path = require('path');
var exec = require('child_process').exec;
var assert = require('assert');
var _ = require('lodash');


/**
 * 外部パーサーを表すクラス
 */
function ExternalParser() {
}

/**
 * 外部パーサーで実行するコマンドを返す
 * @param file    パース対象のファイル
 * @param options パーサーへ渡すオプション
 */
ExternalParser.prototype.getCommand = function (file, options) {
  throw 'Not implemented';
};

/**
 * ファイルを外部パーサーでパースする
 * 外部コマンドは getCommand メソッドで生成されたものを使用する
 * @param file    パース対象のファイル
 * @param options パーサーへのオプション (省略可)
 * @param cb      コールバック関数
 */
ExternalParser.prototype.parseFile = function (file, options, cb) {
  if (typeof options === 'function') {
    cb = options;
    options = {};
  }
  
  var cmd = this.getCommand(file, options);
  var execOptions = _.pick(options, 'cwd');
  
  exec(cmd, execOptions, function (err, stdout, stderr) {
    if (err) { return cb(err); }
    if (stderr) { return cb(stderr); }
    
    try {
      var output = JSON.parse(stdout);
      
      if (output.status === 'success') {
        return cb(null, output.result);
      }
      
      if (output.status === 'fail') {
        return cb(output.result || 'Unknown error');
      }
      
      return cb('Can\'t find a status key in output JSON');
    }
    
    catch (e) {
      cb(e);
    }
  });
};

/**
 * パース実行時のコマンドを返す関数を指定して外部パーサーを生成する
 */
ExternalParser.createParser = function (cmdFunc, parserName) {
  var NewParser = this._createNamedFunction(parserName);
  
  NewParser.prototype = new ExternalParser();
  NewParser.prototype.getCommand = cmdFunc;
  NewParser.prototype.name = parserName;
  
  return NewParser;
};

/**
 * 名前付き関数を返す
 */
ExternalParser._createNamedFunction = function (name) {
  /*jslint -W054 */
  return new Function('return function ' + name + '() { }')();
  /*jslint +W054 */
};

module.exports = ExternalParser;
