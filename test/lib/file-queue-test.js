'use strict';

/*jslint node: true */
/*jslint -W030 */
/*globals describe, it, beforeEach, afterEach */

var Path = require('path');
var _ = require('lodash');
var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');

var FileQueue = require('../../lib/file-queue');


var expect = chai.expect;
chai.use(sinonChai);


describe('Unit test for lib/file-queue.js', function () {
  var sandbox;
  
  beforeEach(function () {
    sandbox = sinon.sandbox.create();
  });
  
  afterEach(function () {
    sandbox.restore();
  });
  
  describe('#constructor', function () {
    it('shoud not throw some errors', function () {
      expect(function () { new FileQueue(); }).to.not.throws();
    });
  });
  
  describe('#enqueue', function () {
    var q;
    
    beforeEach(function () {
       q = new FileQueue();
    });
    
    it('should add file to queue', function () {
      var file = { path: 'example.js' };
      
      expect(q.queue).to.have.length(0);
      
      var newTask = sinon.stub(q, '_newTask');
      q.enqueue(file);
      
      expect(newTask).to.have.been.calledOnce;
      expect(q.queue).to.have.length(1);
      expect(q.queue[0]).to.equal(file);
    });
  });
  
  describe('#_dequeue', function () {
    var q;
    
    beforeEach(function () {
       q = new FileQueue();
    });
    
    it('should not return ok because queue is empty', function () {
      expect(q._dequeue()).to.not.be.ok;
    });
  });
  
  describe('#_newTask', function () {
    var q;
    
    beforeEach(function () {
       q = new FileQueue();
    });
    
    it('should not progress because has not any files!', function () {
      var on_parse = sinon.mock();
      q.on('parse', on_parse);
      q._newTask();
      
      expect(on_parse).to.not.have.been.called;
    });
    
    it('should start parsing', function () {
      q.parallelism = 0;
      q.enqueue({ path: 'example.js' });
      q.parallelism = 1;
      
      var on_parse = sinon.mock();
      
      q.on('parse', on_parse);
      q._newTask();
      
      expect(on_parse).to.have.been.calledOnce;
    });
  });
  
  describe('#_parsed', function () {
    var q;
    
    beforeEach(function () {
       q = new FileQueue();
    });
    
    it('should call `_parsed` when finish parsing', function () {
      var parsed = sandbox.stub(q, '_parsed');
      q.emit('parsed');
      
      expect(parsed).to.have.been.calledOnce;
    });
    
    it('should decrement running tasks', function () {
      q.running = 1;
      q._parsed();
      expect(q.running).to.equal(0);
    });
  });
});
