'use strict';
/*jslint node: true */

var Path = require('path');
var ExternalParser = require('./external-parser');


/**
 * Perl パーサーを呼び出すコマンドを生成する
 * @param file    パース対象のファイル
 * @param options パーサーへのオプション
 */
function getPerlParserCommand(file, options) {
  // perl-parser があるディレクトリをカレントディレクトリとする
  options.cwd = Path.resolve(__dirname, '../perl-parser');
  
  // perl-parser を基準としたパスに変更する
  var fileAbs = Path.resolve(options.cwd, file);
  
  return 'perl main.pl "' + fileAbs + '"';
}


module.exports = ExternalParser.createParser(getPerlParserCommand, 'PerlParser');