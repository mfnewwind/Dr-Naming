'use strict';
/*jslint node: true */

var GitHubApi = require("github");
var _ = require('lodash');
var request = require('superagent');
var async = require('async');
var tmp = require('temporary');

function getGitHubInstance(token) {
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
    token: token
  });
  
  return github;
}


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

function getRepo(gh, owner, repo, cb) {
  gh.repos.get({
    user: owner,
    repo: repo
  }, cb);
}

function getBranch(gh, owner, repo, branch, cb) {
  gh.repos.getBranch({
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
function getRepoTree(gh, owner, repoName, cb) {
  getRepo(gh, owner, repoName, function (err, repo) {
    if (err) { return cb(err); }
    var defaultBranch = repo.default_branch;

    getBranch(gh, owner, repoName, defaultBranch, function (err, branch) {
      if (err) { return cb(err); }

      var sha = branch.commit.sha;
      gh.gitdata.getTree({
        user: owner,
        repo: repoName,
        sha: sha,
        recursive: true
      }, cb);
    });
  });
}

function getRepoFiles(gh, owner, repo, cb) {
  getRepoTree(gh, owner, repo, function (err, tree) {
    if (err) { return cb(err); }

    var files = tree.tree;

    async.map(files, function (file, cb) {
      var url = file.url;
      var result = {
        repo: repo,
        branch: repo,
        path: file.path,
      };

      // TODO: ファイル種類判定
      if (file.type !== 'blob') {
        return cb(null);
      }

      request
        .get(url)
        .set('Accept', 'application/vnd.github.v3.raw')
        .set('Authorization', 'token ' + gh.auth.token)
        .end(function (err, res) {
          if (err) { return cb(err); }

          var file = new tmp.File();
          file.writeFile(res.text, function (err) {
            if (err) { return cb(err); }

            result.local_path = file.path;
            cb(null, result);
          });
        });
    }, function (err, results) {
      if (err) { return cb(err); }
      cb(null, _.compact(results));
    });
  });
}


module.exports = {
  getRepo: getRepo,
  getOrgs: getOrgs,
  getUserRepos: getUserRepos,
  getOrgRepos: getOrgRepos,
  getRepoTree: getRepoTree,
  getRepoFiles: getRepoFiles,
  getGitHubInstance: getGitHubInstance
};
