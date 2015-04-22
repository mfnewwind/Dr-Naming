'use strict';
/*jslint node: true */

var Path = require('path');
var ExternalParser = require('./external-parser');


/**
 * Java パーサーを呼び出すコマンドを生成する
 * @param file    パース対象のファイル
 * @param options パーサーへのオプション
 */
function getPerlParserCommand(file, options) {
  // perl-parser があるディレクトリをカレントディレクトリとする
  options.cwd = Path.resolve(__dirname, '../java-parser');
  
  // perl-parser を基準としたパスに変更する
  var fileAbs = Path.resolve(options.cwd, file);
  
  return 'java -jar JavaParser.jar "' + fileAbs + '"';
}


module.exports = ExternalParser.createParser(getPerlParserCommand, 'JavaParser');