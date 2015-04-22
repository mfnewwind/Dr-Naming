var express = require('express');
var router = express.Router();

/* サイト内で使用するAPI */

router.get('/auth', ensureAuthenticated, function(req, res){
  res.json(req.user);
});


function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.jsonp({});
}

module.exports = router;
