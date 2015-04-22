var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;

module.exports = function() {

  var github_strategy_options = {
    clientID: process.env.GITHUB_CLIENT_ID || "c11a7fc533b95dcfb6a4",
    clientSecret: process.env.GITHUB_CLIENT_SECRET || "b0c68aee9b07f009185404a4d309527d0afed20d",
    callbackURL: "http://localhost:3000/auth/github/callback"
  };

  passport.use(new GitHubStrategy(
    github_strategy_options,
    function(accessToken, refreshToken, profile, done){
      process.nextTick(function () {
        return done(null, profile);
      });
    }
  ));

  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });

  return passport;
};
