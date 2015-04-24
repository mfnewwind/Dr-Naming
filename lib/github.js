'use strict';
/*jslint node: true */

var GitHubApi = require("github");

var github = new GitHubApi({
    // required
    version: "3.0.0",
    // optional
    debug: true,
    protocol: "https",
    host: "api.github.com", // should be api.github.com for GitHub
    pathPrefix: "", // for some GHEs; none for GitHub
    timeout: 5000,
    headers: {
        "user-agent": "Dr. NaminG" // GitHub is happy with a unique user agent
    }
});

function getOrgRepos(org, cb) {
  github.repos.getFromOrg({
    org: org
  }, cb);
}

function getUserRepos(user, cb) {
  github.repos.getFromUser({
      user: user
  }, cb);
}

function getBranch(owner, repo, branch, cb) {
  github.repos.getBranch({
    user: owner,
    repo: repo,
    branch: branch,
  }, cb);
}

function getRepoTree(owner, repo, branch, cb) {
  getBranch(owner, repo, branch, function (err, branch) {
    if (err) { return cb(err); }
    
    var sha = branch.commit;
    github.gitdata.getTree({
      user: owner,
      repo: repo,
      sha: sha,
      recursive: true
    }, cb);
  });
}


module.exports = {
  getUserRepos: getUserRepos,
  getOrgRepos: getOrgRepos,
  getRepoTree: getRepoTree
};