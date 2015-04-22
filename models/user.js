var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  id: String,
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
