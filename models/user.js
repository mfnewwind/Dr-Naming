var mongoose = require('mongoose');

module.exports = function() {

  var userSchema = new mongoose.Schema({

    created_at: {
      type: Date,
      default: Date.now
    }
  });

  messageSchema.statics.latest = function(num, callback) {

    return this.find({

      })
      .sort({
        created_at: 'desc'
      })
      .limit(num)
      .exec(callback);
  };

  mongoose.model('User', userSchema);

};
