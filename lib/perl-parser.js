'use strict';
/*jslint node: true */

var ExternalParser = require('./external-parser');


/**
 * Perl パーサーを呼び出すコマンドを生成する
 * @param file    パース対象のファイル
 * @param options パーサーへのオプション
 */
function getPerlParserCommand(file, options) {
  return 'echo \'{ "status": "success" }\'';
}


module.exports = ExternalParser.createParser(getPerlParserCommand, 'PerlParser');