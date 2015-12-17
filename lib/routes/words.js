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
        if (error) return next(error)

        var words = []
          , originalWords = []

        async.each(results, function (word, eachCb) {
          word = word.toLowerCase()
          originalWords.push(word)

          var combinations = bypassHandler(word)

          words = words.concat(combinations)

          if (req.body.type === 'whitelist') return eachCb()

          var obj = {}

          combinations.forEach(function (bypass) {
            obj[bypass] = word
          })

          client.blacklist.wordsBypass.bulkAdd(obj, function (error, data) {
            if (error) return eachCb(error)

            client.blacklist.wordsBypass.update(data, eachCb)
          })
        }
        , function (error) {
          if (error) return next(error)

          // Refactor
          async.each(req.body.type === 'blacklist' ? originalWords : [], function (word, eachCb) {
            var phonetics = dm.process(word)

            if (!phonetics || !phonetics[0]) return eachCb()

            var obj = {}

            obj[phonetics[0]] = word

            if (phonetics[0] !== phonetics[1]) obj[phonetics[1]] = word

            client.blacklist.phonetics.bulkAdd(obj, function (error, data) {
              if (error) return eachCb(error)

              client.blacklist.phonetics.update(data, eachCb)
            })
          }, function () {
            var fn = req.body.type === 'whitelist' ? client.whitelist.words : client.blacklist.words

            fn.bulkAdd(words, function (error, data) {
              if (error) return next(error)

              self.emit('redsee-created:words', words, req.body.type)
              fn.update(data)

              return res.json({ success: true })
            })
          })
        })

      })
    }

  , delete: function (req, res, next) {
      if (!valid(req, res)) return

      async.map(req.body.msg, filter.normalise.bind(null, client, {}), function (error, results) {
        if (error) return next(error)

        var words = []

        async.each(results, function (word, eachCb) {
          word = word.toLowerCase()
          var combinations = bypassHandler(word)

          words = words.concat(combinations)

          if (req.body.type === 'whitelist') return eachCb()

          // Refactor
          client.blacklist.wordsBypass.bulkRemove(combinations, function (error, data) {
            if (error) return eachCb(error)

            client.blacklist.wordsBypass.update(data, function (error) {
              if (error) return eachCb(error)

              var phonetics = dm.process(word)

              if (!phonetics || !phonetics[0]) return eachCb()

              client.blacklist.phonetics.bulkRemove(phonetics, function (error, data) {
                if (error) return eachCb(error)

                client.blacklist.phonetics.update(data, eachCb)
              })
            })
          })
        }
        , function (error) {
          if (error) return next(error)

          var fn = req.body.type === 'whitelist' ? client.whitelist.words : client.blacklist.words

          fn.bulkRemove(words, function (error, data) {
            if (error) return next(error)

            self.emit('redsee-deleted:words', words, req.body.type)
            fn.update(data)

            return res.json({ success: true })
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
