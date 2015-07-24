var async = require('async')
  , natural = require('natural')
  , dm = natural.DoubleMetaphone
  , bypassHandler = require('../bypass-handler')

module.exports = function (client, filter) {
  var self = this

  return {
    create: function (req, res, next) {
      if (!valid(req, res)) return

      async.map(req.body.msg, filter.normalise.bind(null, client, {}), function (error, results) {
        var words = []

        async.each(results, function (word, eachCb) {
          bypassHandler(word, function (error, combinations) {
            if (error) return eachCb(error)

            words = words.concat(combinations)

            if (req.body.type === 'whitelist') return eachCb()

            async.each(combinations, function (bypass, cb) {
              client.hmset('redsee-blacklist:bypass', bypass, word, cb)
            }, eachCb)

          })
        }
        , function (error) {
          if (error) return next(error)

          var key = req.body.type === 'whitelist' ? 'redsee-whitelist:words' : 'redsee-blacklist:words'

          async.each(words, function (word, eachCb) {
            // Refactor
            if (req.body.type !== 'blacklist') return eachCb()

            var phonetics = dm.process(word)

            if (!phonetics || !phonetics[0]) return eachCb()

            client.hmset('redsee-blacklist:phonetic-words',  phonetics[0], word)

            if (phonetics[0] !== phonetics[1]) {
              client.hmset('redsee-blacklist:phonetic-words',  phonetics[1], word)
            }

            eachCb()
          }, function () {
            client.sadd([ key ].concat(words), function (error, amountAdded) {
              if (error) return next(error)

              self.emit('redsee-created:words', words, req.body.type)

              return res.json({ success: amountAdded })
            })
          })
        })

      })
    }

  , delete: function (req, res, next) {
      if (!valid(req, res)) return

      async.map(req.body.msg, filter.normalise.bind(null, client, {}), function (error, results) {
        var words = []

        async.each(results, function (word, eachCb) {
          bypassHandler(word, function (error, combinations) {
            if (error) return eachCb(error)

            words = words.concat(combinations)

            if (req.body.type === 'whitelist') return eachCb()

            async.each(combinations, function (bypass, cb) {
              client.hdel('redsee-blacklist:bypass', bypass, cb)
            }, eachCb)
          })
        }
        , function (error) {
          if (error) return next(error)

          var key = req.body.type === 'whitelist' ? 'redsee-whitelist:words' : 'redsee-blacklist:words'

          client.srem([ key ].concat(words), function (error, amountDeleted) {
            if (error) return next(error)

            if (amountDeleted) self.emit('redsee-deleted:words', words, req.body.type)

            return res.json({ success: amountDeleted })
          })
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
