var express = require('express');
var router = express.Router();

/* サイト内で使用するAPI */

router.get('/auth', ensureAuthenticated, function(req, res){
  // カプセル
  res.json({
    message: '',
    auth: true,
    user_name: req.user.username,
    avatar_url: req.user._json.avatar_url,
    display_name: req.user.displayName,
    public_repos: req.user._json.public_repos
  });
});


function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.json({
    message: 'Welcome to Dr naminG.',
    auth: false
  });
}

module.exports = router;
