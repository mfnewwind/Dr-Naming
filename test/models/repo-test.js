/*jslint node: true */
/*jslint -W030 */
/*globals describe, it */

var path = require('path');

var expect = require('chai').expect;

var mongoose = require('mongoose');
var database = require('../../lib/database');
var Repo = require('../../models/repo');


describe('### Repo models test', function () {
  var repo_name = 'github.com/mfnewwind/newwind';
  var branch_name = 'master';
  
  describe('Repo', function () {
    it('should create', function (done) {
      Repo.remove({ repo_name: repo_name }, function (err) {
        if (err) { return done(err); }
        
        var repo = new Repo({ repo_name: repo_name });

        repo.save(function (err) {
          done(err);
        });
      });
    });
    
    it('should find', function (done) {
      Repo.findOne({ repo_name: repo_name }, function (err, repo) {
        try {
          expect(err).to.not.be.ok;
          expect(repo).to.have.property('_id').that.is.ok;
          expect(repo).to.have.property('repo_name').that.equal(repo_name);
        }
        
        catch (e) { err = e; }
        finally { done(err); }
      });
    });
    
    it('should remove', function (done) {
      Repo.remove({ repo_name: repo_name }, function (err) {
        try {
          expect(err).to.not.be.ok;
        }
        
        catch (e) { err = e; }
        finally { done(err); }
      });
    });
    
    it('should not find because have already removed', function (done) {
      Repo.findOne({ repo_name: repo_name }, function (err, repo) {
        try {
          expect(err).to.not.be.ok;
          expect(repo).to.not.be.ok;
        }
        
        catch (e) { err = e; }
        finally { done(err); }
      });
    });
  });
  
  describe('Repo:Branch', function () {
    it('should create with empty branch', function (done) {
      Repo.remove({ repo_name: repo_name }, function (err) {
        var repo = new Repo({
          repo_name: repo_name
        });

        repo.branches.push({
          branch_name: branch_name,
          files: []
        });

        repo.save(function (err) {
          done(err);
        });
      });
    });
    
    it('should find with empty branch', function (done) {
      Repo.findOne({ repo_name: repo_name }, function (err, repo) {
        try {
          expect(err).to.not.be.ok;
          expect(repo).to.have.property('_id').that.is.ok;
          expect(repo).to.have.property('repo_name').that.equal(repo_name);
          expect(repo.branches).to.have.length(1);
          expect(repo.branches[0]).to.have.property('branch_name').that.equal(branch_name);
        }
        
        catch (e) { err = e; }
        finally { done(err); }
      });
    });
    
    it('should remove', function (done) {
      Repo.remove({ repo_name: repo_name }, function (err) {
        try {
          expect(err).to.not.be.ok;
        }
        
        catch (e) { err = e; }
        finally { done(err); }
      });
    });
  });
});
