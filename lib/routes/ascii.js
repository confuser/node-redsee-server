module.exports = function (client) {
  var self = this

  return {
    create: function (req, res, next) {
      if (!valid(req, res)) return

      var fn = Array.isArray(req.body.msg) ? client.blacklist.ascii.bulkAdd : client.blacklist.ascii.add

      fn(req.body.msg, function (error, data) {
        if (error) return next(error)

        self.emit('redsee-created:ascii', req.body.msg)
        client.blacklist.ascii.update(data)

        return res.json({ success: true })
      })
    }

  , delete: function (req, res, next) {
      if (!valid(req, res)) return

      var fn = Array.isArray(req.body.msg) ? client.blacklist.ascii.bulkRemove : client.blacklist.ascii.remove

      fn(req.body.msg, function (error, data) {
        if (error) return next(error)

        self.emit('redsee-removed:phrases', req.body.msg)
        client.blacklist.ascii.update(data)

        return res.json({ success: true })
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
