'use strict';
/*jslint node: true */

var mongoose = require('mongoose');
 
var fileSchema = new mongoose.Schema({
  file_name: String,
  path: String,
  url: String,
  result: []
});
 
var branchSchema = new mongoose.Schema({
  branch_name: String,
  files: [ fileSchema ]
});
 
var repoSchema = new mongoose.Schema({
  repo_name: String,
  branches: [ branchSchema ]
});

module.exports = mongoose.model('Repo', repoSchema);
