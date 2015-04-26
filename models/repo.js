'use strict';
/*jslint node: true */

var mongoose = require('mongoose');

var fileSchema = new mongoose.Schema({
  file_name: String,
  path: String,
  url: String,
  status: String,
  result: mongoose.Schema.Types.Mixed,
  _id: false
});

var branchSchema = new mongoose.Schema({
  branch_name: {
    type: String,
    defalut: 'master'
  },
  files: [ fileSchema ],
  _id: false
});

var repoSchema = new mongoose.Schema({
  repo_name: String,
  repo: String,
  owner: String,
  sync: {
    type: Boolean,
    default: false
  },
  branches: [ branchSchema ]
});

module.exports = mongoose.model('Repo', repoSchema);
