'use strict';
/*jslint node: true */

var GitHubApi = require("github");
var request = require('superagent');
var async = require('async');

var github = new GitHubApi({
    // required
    version: "3.0.0",
    // optional
    debug: false,
    protocol: "https",
    host: "api.github.com", // should be api.github.com for GitHub
    pathPrefix: "", // for some GHEs; none for GitHub
    timeout: 5000,
    headers: {
        "user-agent": "Dr. NaminG" // GitHub is happy with a unique user agent
    }
});

github.authenticate({
    type: 'token',
    token: '4996afada887bdc6c78aecaae321834680b29d27'
});


/**
 * 組織一覧を取得する
 * @param userName ユーザー名
 */
function getOrgs(userName, cb) { 
  github.orgs.getFromUser({
    user: userName
  }, cb);
}

/**
 * 組織のレポジトリ一覧を取得する
 */
function getOrgRepos(org, cb) {
  github.repos.getFromOrg({
    org: org
  }, cb);
}

/**
 * ユーザーのレポジトリ一覧を取得する
 */
function getUserRepos(user, cb) {
  github.repos.getFromUser({
      user: user
  }, cb);
}

function getRepo(owner, repo, cb) {
  github.repos.get({
    user: owner,
    repo: repo
  }, cb);
}

function getBranch(owner, repo, branch, cb) {
  github.repos.getBranch({
    user: owner,
    repo: repo,
    branch: branch,
  }, cb);
}

/**
 * @param owner  所有者 (例: mfnewwind)
 * @param repo   レポジトリ名 (例: newwind)
 * @param cb     コールバック関数 (レポジトリのファイル一覧)
 */
function getRepoTree(owner, repoName, cb) {
  getRepo(owner, repoName, function (err, repo) {
    if (err) { return cb(err); }
    var defaultBranch = repo.default_branch;
  
    getBranch(owner, repoName, defaultBranch, function (err, branch) {
      if (err) { return cb(err); }

      var sha = branch.commit.sha;
      github.gitdata.getTree({
        user: owner,
        repo: repoName,
        sha: sha,
        recursive: true
      }, cb);
    });
  });
}

function getRepoFiles(owner, repo, cb) {
  getRepoTree(owner, repo, function (err, tree) {
    console.log(err);
    if (err) { return cb(err); }
    
    var files = tree.tree;
    
    async.map(files, function (file, cb) {
      var url = file.url;
      var result = {
        repo: repo,
        path: file.path,
      };
      
      request
        .get(url)
        .set('Accept', 'application/vnd.github.v3.raw')
        .end(function (err, res) {
          //console.log(err, res.body);
          cb(err);
        });
    }, function (err, results) {
      console.log(err, results);
    });
  });
}


module.exports = {
  getRepo: getRepo,
  getOrgs: getOrgs,
  getUserRepos: getUserRepos,
  getOrgRepos: getOrgRepos,
  getRepoTree: getRepoTree,
  getRepoFiles: getRepoFiles
};

console.log(getRepoFiles('pine613', 'dotfiles', function(err){ console.error(err); }));