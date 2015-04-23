var Vue = require('vue');
var request = require('superagent');

window.doctorNaminG = new Vue({
  el: '#DN',
  components: {
    header: require('./header')
  },
  data: {
    title: 'DoctorNaminG',
    avatar: {}
  },
  methods: {},
  ready: function() {
  }
});
