var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;

module.exports = function() {

  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });


  var strategy_options = {
    clientID: process.env.GITHUB_CLIENT_ID || "",
    clientSecret: process.env.GITHUB_CLIENT_SECRET | "",
    callbackURL: "http://127.0.0.1:3000/auth/github/callback"
  };

  passport.use(new GitHubStrategy(
    strategy_options,
    function(accessToken, refreshToken, profile, done){
      process.nextTick(function () {
        return done(null, profile);
      });
    }
  ));


  function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
      res.redirect('/login');
  }

};
