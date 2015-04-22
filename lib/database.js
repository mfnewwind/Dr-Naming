var mongoose = require('mongoose');

var mongodb_uri = process.env.MONGOLAB_URI || 'mongodb://localhost/dr-naming';

mongoose.connect(mongodb_uri, function(err) {
  if (err) {
    console.error('mongoose connect error');
    throw err;
  }
});
