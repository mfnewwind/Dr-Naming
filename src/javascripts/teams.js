var request = require('superagent');

module.exports = {
  template: '#teams_component',
  methods: {},
  ready: function() {

    console.log('teams compoennt');

    var _this = this;
    request
      .get('/siteapi/orgs')
      .accept('json')
      .end(function(err, res) {
        if (err)  { return console.log('user data get error: ', err); }

        _this.$root.$data.avatar.orgs = res.body.auth ? res.body.orgs : null;
        // _this.$emit('avatar-loaded');
      });

    this.$el.classList.remove('hide');
  }
};
