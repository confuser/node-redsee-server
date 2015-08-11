module.exports = function (client) {
  var self = this

  return {
    create: function (req, res, next) {
      if (!valid(req, res)) return

      client.sadd([ client.prefix + 'redsee-blacklist:ascii' ].concat(req.body.msg), function (error, amountAdded) {
        if (error) return next(error)

        self.emit('redsee-created:ascii', req.body.msg)

        return res.json({ success: amountAdded })
      })
    }

  , delete: function (req, res, next) {
      if (!valid(req, res)) return

      client.srem([ client.prefix + 'redsee-blacklist:ascii' ].concat(req.body.msg), function (error, amountDeleted) {
        if (error) return next(error)

        self.emit('redsee-removed:phrases', req.body.msg)

        return res.json({ success: amountDeleted })
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

  return true

}
