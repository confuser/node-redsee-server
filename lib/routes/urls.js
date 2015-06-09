var urlMatcher = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/ig

module.exports = function (client) {
  var self = this

  return {
    create: function (req, res, next) {
      if (!valid(req, res)) return

      var results = normalise(req.body.msg)

      client.sadd([ 'redsee-whitelist:urls' ].concat(results), function (error, amountAdded) {
        if (error) return next(error)

        self.emit('redsee-created:urls', results)

        return res.json({ success: amountAdded })
      })
    }

  , delete: function (req, res, next) {
      if (!valid(req, res)) return

      var results = normalise(req.body.msg)

      client.srem([ 'redsee-whitelist:urls' ].concat(results), function (error, amountDeleted) {
        if (error) return next(error)

        self.emit('redsee-deleted:urls', results)

        return res.json({ success: amountDeleted })
      })
    }
  }
}

function normalise(data) {
  return data.map(function (item) { return item.toLowerCase() } )
}

function valid(req, res) {
  if (!req.body.msg) {
    res.status(400).json({ error: 'missing msg body' })
    return false
  }

  if (!Array.isArray(req.body.msg) || req.body.msg.length === 0) {
    res.status(400).json({ error: 'msg is not an array or is empty' })
    return false
  }

  var results = req.body.msg.filter(function (url) {
    // TODO change to .test
    var matches = url.match(urlMatcher)

    return !matches || matches.length === 0
  })

  if (results.length > 0) {
    res.status(400).json({ error: 'invalid urls' })
    return false
  }

  return true
}
