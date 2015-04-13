path = require('path')
assert = require('assert')

pkg = require path.resolve 'package'

describe '# models', ->

  it 'model 1', () ->

    assert.equal "hoge", "hoge"
