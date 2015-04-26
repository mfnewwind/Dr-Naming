var path = require('path');
var assert = require('assert');

var expect = require('chai').expect;

var pkg = require(path.resolve('package'));

var mongoose = require('mongoose');
var database = require('../../lib/database');
var User = require('../../models/user');


describe('### user models test', function () {

  it('# user create -> findOne -> deleteOne', function (done) {

    var user_id = 'testuserid';

    try {

      var user = new User({ github_id: user_id });

      user.save(function(err) {

        if (err) { throw err;}

        User.findOne({
          github_id: user_id
        }, function(err, user) {

          if (err) { throw err; }
          console.log('userdata: ', JSON.stringify(user));

          User.remove({
            github_id: user_id
          }, function(err) {

            if (err) { throw err;}

            done();

          });

        });

      });
    } catch(e) {

      console.error(e);
      done();

    }
  });

});
