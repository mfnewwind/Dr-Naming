var request = require('superagent');

module.exports = {
  template: '#teams_component',
  methods: {
    tabTeam: function(owner) {
      this.getRepositories(owner || '');
    },
    getRepositories: function(owner) {
      this.$dispatch('get repositories', [owner]);
    },
    getOrganizations: function() {
      var _this = this;
      request
        .get('/siteapi/orgs')
        .accept('json')
        .end(function(err, res) {
          if (err)  { return console.log('user data get error: ', err); }

          _this.$root.$data.avatar.orgs = res.body.auth ? res.body.orgs : null;
        }
      );
    }
  },
  ready: function() {

    this.getOrganizations(null);

    this.$el.classList.remove('hide');
  }
};
