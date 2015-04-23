request = require('superagent');

module.exports = {
  template: '#header_component',
  methods: {},
  ready: function() {
    var _this = this;
    request
      .get('/siteapi/auth')
      .accept('json')
      .end(function(err, res) {
        if (err)  { return console.log('user data get error: ', err); }
        if (!res) { return; }

        _this.$root.$data.avatar.github = res.body._json;
        _this.$emit('avatar-loaded');
      });

    this.$el.classList.remove('hide');
  }
};
