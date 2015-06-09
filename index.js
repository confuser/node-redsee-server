var EventEmitter = require('events').EventEmitter
  , mixin = require('merge-descriptors')

module.exports = createServer

function createServer(client, filter) {
  var server = {}

  // Emit and listen to events
  mixin(server, EventEmitter.prototype, false)

  // Define the routers
  var routes =
    { emails: require('./lib/routes/emails').bind(server)(client, filter)
    , filter: require('./lib/routes/filter').bind(server)(client, filter)
    , phrases: require('./lib/routes/phrases').bind(server)(client, filter)
    , urls: require('./lib/routes/urls').bind(server)(client, filter)
    , words: require('./lib/routes/words').bind(server)(client, filter)
    }

  Object.defineProperty
  ( server
  , 'routes'
  , { configurable: false
    , get: function () { return routes }
    , set: function () { throw new Error('You cannot alter the routes') }
    }
  )

  return server
}
