var Vue = require('vue');
var request = require('superagent');

window.doctorNaminG = new Vue({
  el: '#DN',
  components: {
    header: require('./header'),
    teams: require('./teams'),
    select_repos: require('./select_repos'),
    add_repos: require('./add_repos'),
  },
  data: {
    title: 'DoctorNaminG',
    avatar: {
      github: {},
      orgs: {}
    },
    repos: {}
  },
  methods: {},
  ready: function() {
  }
});
