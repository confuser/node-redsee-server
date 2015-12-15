var express = require('express')
  , bodyParser = require('body-parser')
  , createClient = require('redsee-client')
  , filter = require('redsee-filter')
  , redseeServer = require('../')

module.exports = function (callback) {
  var app = express()

  createClient(null, function (error, client) {
    if (error) return callback(error)

    var server = redseeServer(client, filter)

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

    callback(null, app)
  })

}
