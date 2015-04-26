var request = require('superagent');

module.exports = {
  template: '#repos_component',
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

    console.log('repos compoennt');

    this.getRepositories(null);

    this.$el.classList.remove('hide');
  }
};
