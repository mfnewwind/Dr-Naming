var express = require('express');
var router = express.Router();

var url = require('url');
var passport = require('../lib/passports')();

var User = require('../models/user');

var github = require('../lib/github');

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

    res.redirect(url.resolve('/', (req.session.callback_uri || '')));

});

module.exports = router;
