var plan = require('flightplan');

plan.target('staging', {
  host: '52.69.179.105',
  username: 'ec2-user',
  agent: process.env.SSH_AUTH_SOCK
});

plan.remote(function (remote) {
  remote.with('cd ~/Dr-Naming', function () {
    remote.log('Show system information');
    remote.exec('echo Node $(node -v)');
    remote.exec('perl -v');

    // git
    remote.log('Update files');
    remote.git('submodule init');
    remote.git('submodule update');
    remote.git('reset --hard HEAD');
    remote.git('fetch origin master');
    remote.git('checkout master');
    remote.git('pull origin master');

    // npm
    remote.log('Install denepdencies');
    remote.exec('npm install');

    // forever
    remote.log('Stop daemon');
    remote.exec('forever list');
    remote.exec('forever stop dr-naming', { failsafe: true });

    remote.log('Start daemon');
    remote.exec('forever start -a --uid dr-naming ./bin/www');
    remote.exec('forever list');
  });
});
