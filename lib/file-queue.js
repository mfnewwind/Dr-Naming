'use strict';
/*jslint node: true */

var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');

/**
 * 処理するファイルのタスクキュー
 */
function FileQueue() {
  this.clear();
  
  EventEmitter.call(this);
  
  var _this = this;
  this.on('parsed', function (err, file) { _this._parsed(err, file); });
}

FileQueue.prototype = new EventEmitter();

/**
 * キューにファイルを追加する
 * @param file ファイルを表すオブジェクト
 */
FileQueue.prototype.enqueue = function (file) {
  this.queue.push(file);
  this._newTask();
};

/**
 * キューをクリアする
 */
FileQueue.prototype.clear = function () {
  this.parallelism = 1;  // 同時並行実行タスク数
  this.running     = 0;  // 実行中タスク
  this.queue       = []; // ファイルキュー
};

/**
 * キューからファイルを取得し削除する
 * キューに何もファイルが存在しない場合は偽を返す
 */
FileQueue.prototype._dequeue = function () {
  return this.queue.shift();
};


/**
 * 現在実行中のタスクが並列実行数に満たなかったら、新規タスクを開始する
 */
FileQueue.prototype._newTask = function () {
  while (this.running < this.parallelism) {
    var file = this._dequeue();
    if (!file) { break; } // 処理するファイルが存在しない場合
    
    this.emit('parse', file);
    ++this.running;
  }
};

/**
 * ファイルの解析後の処理を行う
 */
FileQueue.prototype._parsed = function (err, file) {
  if (this.running > 0) { --this.running; }
  this._newTask();
};


module.exports = FileQueue;