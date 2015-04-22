'use strict';
/*jslint node: true */

var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');

/**
 * 処理するファイルのタスクキュー
 */
function FileQueue() {
  this.parallelism = 1;  // 同時並行実行タスク数
  this.running     = 0;  // 実行中タスク
  this.queue       = []; // ファイルキュー
  
  this.on('parse', this._parse.bind(this));
  this.on('parsed', this._newTask.bind(this));
  
  EventEmitter.call(this);
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
    this.emit('parse', this._dequeue());
    ++this.running;
  }
};

/**
 * ファイルの解析処理を行う
 */
FileQueue.prototype._parse = function (file) {
  console.log(file);
  this.emit('parsed');
};


module.exports = FileQueue;