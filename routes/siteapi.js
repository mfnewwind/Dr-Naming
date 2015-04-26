var express = require('express');
var router = express.Router();
var _ = require('lodash');
var request = require('superagent');

var parser = require('../lib/parser');

var User = require('../models/user');
var Repo = require('../models/repo');

/* サイト内で使用するAPI */

router.get('/auth', ensureAuthenticated, function(req, res){

    res.json({
      message: '',
      auth: true,
      user_name: req.user.username,
      avatar_url: req.user._json.avatar_url,
      display_name: req.user.displayName,
      public_repos: req.user._json.public_repos
    });

});

router.get('/orgs', ensureAuthenticated, function(req, res) {

  request
  .get("https://api.github.com/users/" + req.user.username + "/orgs")
  // .set('Accept', 'application/vnd.github.moondragon+json')
  .set('Authorization', 'token ' + req.user.token)
  .end(function(err, orgs) {

    if (err) return res.set(500).json({ message: err });

    res.json({
      auth: true,
      orgs: _.map(orgs.body, function(org) {
        return {
          name: org.login,
          github_id: org.id,
          avatar_url: org.avatar_url
        };
      })
    });

  });

});

router.get('/repos', ensureAuthenticated, function(req, res) {

  var api_route = req.query.owner ? 'orgs/' +  req.query.owner : 'users/' + req.user.username;

  Repo
  .find({ sync: true, owner: req.query.owner || req.user.username })
  .select('-_id repo_name repo owner sync branches')
  .exec(function(err, repos) {

    if (err) return res.set(500).json({ message: err });

    return res.json({
      auth: true,
      repos: repos
    });

  });

});

router.get('/select_repos', ensureAuthenticated, function(req, res) {

  var api_route = req.query.owner ? 'orgs/' +  req.query.owner : 'users/' + req.user.username;

  request
  .get("https://api.github.com/" + api_route + "/repos")
  // .set('Accept', 'application/vnd.github.moondragon+json')
  .set('Authorization', 'token ' + req.user.token)
  .end(function(err, github_repos) {

    if (err) return res.set(500).json({ message: err });

    Repo
    .where({ sync: true, owner: req.query.owner || req.user.username })
    .find(function(err, db_repos) {

      if (err) return res.set(500).json({ message: err });

      return res.json({
        auth: true,
        repos: github_repos.body,
        synced_repos: db_repos
      });

    });

  });

});



router.post('/add_repo', ensureAuthenticated, function(req, res) {

  if (! req.body.owner) return res.set(500).json({ message: 'オーナーまたはチーム名がありません' });
  if (! req.body.repo)  return res.set(500).json({ message: 'レポジトリ名がありません' });

  var repository = 'github.com/' + req.body.owner + '/' + req.body.repo;

  Repo.update({ repo_name: repository },
    {
      repo_name: repository,
      repo: req.body.repo,
      owner: req.body.owner,
      sync: true,
      branches: [
        { branch_name: 'master', files: [] }
      ]
    },
    { upsert: true },
    function(err, raw) {
      if (err) { res.set(500).json({ message: err }); }

      parser.enqueueRepo(req.user.token, repository , function (err) {
        if (err) {
          console.error(err);
          return res.set(500).json({message: err});
        }
        return res.set(200).json({message: '追加しました' });
      });
    }
  );

});

router.post('/remove_repo', ensureAuthenticated, function(req, res) {

  if (! req.body.owner) return res.set(500).json({ message: 'オーナーまたはチーム名がありません' });
  if (! req.body.repo)  return res.set(500).json({ message: 'レポジトリ名がありません' });

  var repository = 'github.com/' + req.body.owner + '/' + req.body.repo;

  Repo.update({ repo_name: repository },
    {
      sync: false
    },
    { upsert: false },
    function(err, raw) {
      if (err) { res.set(500).json({ message: err }); }
      return res.set(200).json({message: '削除しました'});
    }
  );

});


function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.json({
    message: 'Welcome to Dr naming.',
    auth: false
  });
}

module.exports = router;
