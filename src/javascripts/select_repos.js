var request = require('superagent');

module.exports = {
  template: '#select_repos_component',
  methods: {
    getRepositories: function(owner) {
      var _this = this;
      request
        .get('/siteapi/select_repos')
        .query({ owner: owner })
        .accept('json')
        .end(function(err, res) {
          if (err)  { return console.log('user data get error: ', err); }

          _this.$root.$data.repos = res.body.auth ? res.body.repos : null;
        }
      );
    },
    addRepository: function(owner, repo, callback) {
      var _this = this;
      request
        .post('/siteapi/add_repo')
        .send({
          owner: owner,
          repo: repo
        })
        .accept('json')
        .end(function(err, res) {
          if (err)  { return console.log('add error: ', err); }

          return callback();
        }
      );
    },
    onCheckboxClicked: function(e, owner, repo) {
      //e.$event.preventDefault();

      this.addRepository(owner, repo, function() {

      });

    }
  },
  ready: function() {

    console.log('repos compoennt');

    var self = this;

    this.$on('get repositories', function(owner) {
      console.log('get get');
      self.getRepositories(owner);
    });

    this.getRepositories(null);

    this.$el.classList.remove('hide');
  }
};
