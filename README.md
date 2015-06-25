# redsee-server

[![Build Status](https://travis-ci.org/confuser/node-redsee-server.png?branch=master)](https://travis-ci.org/confuser/node-redsee-server)
[![Coverage Status](https://coveralls.io/repos/confuser/node-redsee-server/badge.png?branch=master)](https://coveralls.io/r/confuser/node-redsee-server?branch=master)

Helper functions for implementing a RedSee filter server via [redsee-filter](https://github.com/confuser/node-redsee-filter)

See [RedSee](https://github.com/Frostcast/RedSee) for an example implementation along with a demo

## Installation
```
npm install redsee-server --save
```

## Usage
```js
var express = require('express')
  , bodyParser = require('body-parser')
  , redis = require('redis')
  , filter = require('redsee-filter')
  , redseeServer = require('redsee-server')

require('redis-scanstreams')(redis)

module.exports = function () {
  var app = express()
    , client = redis.createClient(null, null, { fast: true })
    , server = redseeServer(client, filter)

  app
    .use(bodyParser.urlencoded({ extended: true }))
    .use(bodyParser.json())

  // Routes
  app.post('/filter/email', server.routes.emails.create)
  app.delete('/filter/email', server.routes.emails.delete)

  app.post('/filter', server.routes.filter)

  app.post('/filter/phrase', server.routes.phrases.create)
  app.delete('/filter/phrase', server.routes.phrases.delete)

  app.post('/filter/url', server.routes.urls.create)
  app.delete('/filter/url', server.routes.urls.delete)

  app.post('/filter/word', server.routes.words.create)
  app.delete('/filter/word', server.routes.words.delete)

  app.post('/filter/ascii', server.routes.ascii.create)
  app.delete('/filter/ascii', server.routes.ascii.delete)

  app.redisClient = client

  return app
}

```
