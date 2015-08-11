var async = require('async')

module.exports = function (client, filter) {
  var self = this

  return {
    create: function (req, res, next) {
      if (!valid(req, res)) return

      async.map(req.body.msg, filter.normalise.bind(null, client, {}), function (error, results) {
        var key = req.body.type === 'whitelist' ? 'redsee-whitelist:phrases' : 'redsee-blacklist:phrases'

        client.sadd([ client.prefix + key ].concat(results), function (error, amountAdded) {
          if (error) return next(error)

          self.emit('redsee-created:phrases', results, req.body.type)

          return res.json({ success: amountAdded })
        })
      })
    }

  , delete: function (req, res, next) {
      if (!valid(req, res)) return

      async.map(req.body.msg, filter.normalise.bind(null, client, {}), function (error, results) {
        var key = req.body.type === 'whitelist' ? 'redsee-whitelist:phrases' : 'redsee-blacklist:phrases'

        client.srem([ client.prefix + key ].concat(results), function (error, amountDeleted) {
          if (error) return next(error)

          self.emit('redsee-deleted:phrases', results, req.body.type)

          return res.json({ success: amountDeleted })
        })
      })
    }
  }
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

  if (!req.body.type) {
    res.status(400).json({ error: 'missing type' })
    return false
  }

  if (req.body.type !== 'blacklist' && req.body.type !== 'whitelist') {
    res.status(400).json({ error: 'invalid type' })
    return false
  }

  return true

}
