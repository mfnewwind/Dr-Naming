var mongoose = require('mongoose');

var repoSchema = new mongoose.Schema({
  repo_name: String, // ex. [repo_name]
  repo_url: String, // ex. github.com/[user_name]/[repo_name]
  sync: {
    type: Boolean,
    default: false
  }
});

var orgSchema = new mongoose.Schema({
  name: String,
  github_id: String,
  avatar_url: String
});

var userSchema = new mongoose.Schema({
  github_id: {
    type: String,
    unique: true
  },
  email: {
    type: String,
    default: ''
  },
  orgs: [ orgSchema ],
  repos: [ repoSchema ],
  token: String,
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
