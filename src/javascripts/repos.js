var request = require('superagent');

module.exports = {
  template: '#repos_component',
  methods: {},
  ready: function() {

    console.log('repos compoennt');

    var _this = this;
    request
      .get('/siteapi/repos')
      .accept('json')
      .end(function(err, res) {
        if (err)  { return console.log('user data get error: ', err); }

        console.log(res.body);

        _this.$root.$data.repos = res.body.auth ? res.body.repos : null;
        // _this.$emit('avatar-loaded');
      });

    this.$el.classList.remove('hide');
  }
};
