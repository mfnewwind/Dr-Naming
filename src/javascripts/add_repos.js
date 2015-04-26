var request = require('superagent');

module.exports = {
  template: '#add_repos_component',
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
    },
    addRepository: function(owner, repo) {
      var _this = this;
      request
        .get('/siteapi/add_repo')
        .query({
          owner: owner,
          repo: repo
        })
        .accept('json')
        .end(function(err, res) {
          if (err)  { return console.log('add error: ', err); }

          console.log(res);
        }
      );
    },
    onCheckboxClicked: function(e, owner, repo) {
      e.preventDefault();

      
    }
  },
  ready: function() {

    console.log('repos compoennt');

    this.getRepositories(null);

    this.$el.classList.remove('hide');
  }
};
