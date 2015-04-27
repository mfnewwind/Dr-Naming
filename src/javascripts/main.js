var Vue = require('vue');
var request = require('superagent');

window.doctorNaming = new Vue({
  el: '#DN',
  components: {
    header: require('./header'),
    teams: require('./teams'),
    repos: require('./repos'),
    select_repos: require('./select_repos'),
    repo_app: require('./repo_app')
  },
  data: {
    title: 'DoctorNaming',
    avatar: {
      github: {},
      orgs: {}
    },
    repo: {},
    repos: {},
    urls: {
      orgs: '/siteapi/orgs',
      repos: '/siteapi/repos',
      select_repos: '/siteapi/select_repos'
    }
  },
  methods: {},
  ready: function() {
    var self = this;
    this.$on('get repositories', function(owner) {
      self.$broadcast('get repositories', [owner]);
    });
  },
  filters: {
    date: function (str) {
      var d = new Date(str);
      return d.getFullYear() + '/' +
        ('0' + d.getMonth()).slice(-2) + '/' +
        ('0' + d.getDay()).slice(-2);
    }
  }
});
