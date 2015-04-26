var Vue = require('vue');
var request = require('superagent');

window.doctorNaminG = new Vue({
  el: '#DN',
  components: {
    header: require('./header'),
    teams: require('./teams'),
    repos: require('./repos'),
    select_repos: require('./select_repos'),
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
