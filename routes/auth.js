var express = require('express');
var router = express.Router();

var url = require('url');
var passport = require('../lib/passports')();

var User = require('../models/user');

/* auth request */

router.get('/github',
  passport.authenticate('github', { scope: ['user:email', 'read:org'] }),
  function(req, res) {
    req.session.callback_uri = req.param('callback_uri') || '';
});

router.get('/github/callback',
  passport.authenticate('github', {
    failureRedirect: '/login'
  }),
  function(req, res) {

    // user exists?
    User
      .where({ github_id: req.user.id })
      .findOne(function(err, user) {
        if (err) return console.error(err);
        if (user) {
          console.log('user exist.');
          updateUser(user);
        } else {
          console.log('user is undefined.');
          createUser(req);
        }
      });

    res.redirect(url.resolve('/', (req.session.callback_uri || '')));
});

// ログイン時にユーザデータの更新
function updateUser(user) {}

// 初回ログイン時にユーザデータ登録
function createUser(user) {}

module.exports = router;
