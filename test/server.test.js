var assert = require('assert')
  , createServer = require('../')

describe('Server', function () {

  it('should not allow modifying of routes', function () {
    var server = createServer()

    assert.throws(function () {
      server.routes = null
    }, /You cannot alter the routes/)
  })

})
