var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;
var url = require('url');
var request = require('superagent');
var _ = require('lodash');

var User = require('../models/user');

module.exports = function() {

  var github_strategy_options = {
    // 指定がない場合はdr-naming-test(localhost用)に繋がる
    clientID:     process.env.GITHUB_CLIENT_ID     || "c11a7fc533b95dcfb6a4",
    clientSecret: process.env.GITHUB_CLIENT_SECRET || "b0c68aee9b07f009185404a4d309527d0afed20d",
    // 指定が無い場合はgulp環境想定
    callbackURL: url.resolve((process.env.BASE_URL || "http://localhost:3000/"), "/auth/github/callback")
  };

  passport.use(new GitHubStrategy(
    github_strategy_options,
    function(accessToken, refreshToken, profile, done){
      process.nextTick(function () {

        profile.token = accessToken;

        User.update({ github_id: profile.id },
          {
            github_id: profile.id,
            email:     profile.email,
            token:     accessToken
          },
          { upsert: true },
          function(err, raw) {
            return done(err, profile);
        });

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
