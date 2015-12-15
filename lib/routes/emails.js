var emailMatcher = /[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/ig

module.exports = function (client) {
  var self = this

  return {
    create: function (req, res, next) {
      if (!valid(req, res)) return

      var results = normalise(req.body.msg)

      client.whitelist.emails.bulkAdd(results, function (error, data) {
        if (error) return next(error)

        self.emit('redsee-created:emails', results)
        client.whitelist.emails.update(data)

        return res.json({ success: true })
      })
    }
  , delete: function (req, res, next) {
      if (!valid(req, res)) return

      var results = normalise(req.body.msg)

      client.whitelist.emails.bulkRemove(results, function (error, data) {
        if (error) return next(error)

        self.emit('redsee-deleted:emails', results)
        client.whitelist.emails.update(data)

        return res.json({ success: true })
      })
    }
  }
}

function normalise(data) {
  return data.map(function (item) { return item.toLowerCase() })
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

  var results = req.body.msg.filter(function (email) {
    // TODO change to .test
    var matches = email.match(emailMatcher)

    return !matches || matches.length === 0
  })

  if (results.length > 0) {
    res.status(400).json({ error: 'invalid emails' })
    return false
  }

  return true
}
