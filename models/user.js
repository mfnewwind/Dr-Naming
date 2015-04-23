var mongoose = require('mongoose');

var repoSchema = new mongoose.Schema({
  repo_name: String, // ex. [repo_name]
  repo_url: String, // ex. github.com/[user_name]/[repo_name]
  sync: Boolean
});

var userSchema = new mongoose.Schema({
  github_name: String,
  orgs: [], //organizations
  repos: [ repoSchema ],
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
