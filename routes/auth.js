var express = require('express');
var router = express.Router();

var passport = require('../lib/passports')();

/* auth request */

router.get('/github',
  passport.authenticate('github'),
  function(req, res){
    // nothing to do.
});

router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
});

module.exports = router;
