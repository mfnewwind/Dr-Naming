var plan = require('flightplan');

plan.target('staging', {
  host: '52.69.179.105',
  username: 'ec2-user',
  agent: process.env.SSH_AUTH_SOCK
});

plan.remote(function (remote) {
  remote.log('remote');
});
