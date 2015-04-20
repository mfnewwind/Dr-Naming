var component1 = require('./component1');

var hoge, foo, bar;

hoge = 'public hoge';

var fn = function() {
  this.hoge = 'private hoge';
  console.log('hello, this is fn');
};
