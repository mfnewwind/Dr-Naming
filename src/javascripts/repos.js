var request = require('superagent');
var _ = require('lodash');

module.exports = {
  template: '#repos_component',
  filters: {
    statusCheck: function(files) {
      if (_.some(files, { status: 'fail' })) {
        return 'fa-exclamation-triangle';
      }

      return 'fa-check';
    }
  },
  methods: {
    getRepositories: function(owner) {
      var _this = this;
      request
        .get('/siteapi/repos')
        .query({ owner: owner })
        .accept('json')
        .end(function(err, res) {
          if (err)  { return console.log('user data get error: ', err); }

          _this.$root.$data.repos = res.body.auth ? res.body.repos : null;
        }
      );
    }
  },
  ready: function() {

    var _this = this;

    this.$on('get repositories', function(owner) {
      console.log('catch event');
      _this.getRepositories(owner);
    });

    this.getRepositories(null);

    this.$el.classList.remove('hide');
  }
};
