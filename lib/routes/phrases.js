var async = require('async')

module.exports = function (client, filter) {
  var self = this

  return {
    create: function (req, res, next) {
      if (!valid(req, res)) return

      async.map(req.body.msg, filter.normalise.bind(null, client, {}), function (error, results) {
        if (error) return next(error)

        var fn = req.body.type === 'whitelist' ? client.whitelist.phrases : client.blacklist.phrases

        fn.bulkAdd(results, function (error, data) {
          if (error) return next(error)

          self.emit('redsee-created:phrases', results, req.body.type)
          fn.update(data)

          return res.json({ success: true })
        })
      })
    }

  , delete: function (req, res, next) {
      if (!valid(req, res)) return

      async.map(req.body.msg, filter.normalise.bind(null, client, {}), function (error, results) {
        if (error) return next(error)

        var fn = req.body.type === 'whitelist' ? client.whitelist.phrases : client.blacklist.phrases

        fn.bulkRemove(results, function (error, data) {
          if (error) return next(error)

          self.emit('redsee-deleted:phrases', results, req.body.type)
          fn.update(data)

          return res.json({ success: true })
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
