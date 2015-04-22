#!/usr/bin/perl

use strict;
use utf8;
use 5.010;

my $message = 'This is a test Perl file';
say $message;
  
sub testFunc {
  say 'testFunc called!';
}

testFunc();
