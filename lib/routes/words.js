var async = require('async')
  , sum = require('lodash.sum')
  , natural = require('natural')
  , dm = natural.DoubleMetaphone
  , XXHash = require('xxhash')
  , seed = 0xCAFEBABE // This may need to change, based on xxhash docs
  , bypassHandler = require('../bypass-handler')

module.exports = function (client, filter) {
  var self = this

  return {
    create: function (req, res, next) {
      if (!valid(req, res)) return

      async.map(req.body.msg, filter.normalise.bind(null, client, {}), function (error, results) {
        var words = []
          , originalWords = []

        async.each(results, function (word, eachCb) {
          originalWords.push(word)

          var combinations = bypassHandler(word)
          words = words.concat(combinations)

          if (req.body.type === 'whitelist') return eachCb()

          async.each(combinations, function (bypass, cb) {
            client.hmset(client.prefix + 'redsee-blacklist:bypass', bypass, word, cb)
          }, eachCb)

        }
        , function (error) {
          if (error) return next(error)

          // Refactor
          async.each(req.body.type === 'blacklist' ? originalWords : [], function (word, eachCb) {
            var phonetics = dm.process(word)

            if (!phonetics || !phonetics[0]) return eachCb()

            client.hmset(client.prefix + 'redsee-blacklist:phonetic-words',  phonetics[0], word)

            if (phonetics[0] !== phonetics[1]) {
              client.hmset(client.prefix + 'redsee-blacklist:phonetic-words',  phonetics[1], word)
            }

            eachCb()
          }, function () {
            var multi = client.multi()
              , key = req.body.type === 'whitelist' ? 'redsee-whitelist:words:' : 'redsee-blacklist:words:'

            words.forEach(function (word) {
              var hash = XXHash.hash(new Buffer(word), seed)
                , bucket = hash % 500000

              multi.sadd(client.prefix + key + bucket, hash)
            })

            multi.exec(function (error, data) {
              if (error) return next(error)

              self.emit('redsee-created:words', words, req.body.type)

              return res.json({ success: sum(data) })
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
          var combinations = bypassHandler(word)

          words = words.concat(combinations)

          if (req.body.type === 'whitelist') return eachCb()

          async.each(combinations, function (bypass, cb) {
            client.hdel(client.prefix + 'redsee-blacklist:bypass', bypass, cb)
          }, eachCb)
        }
        , function (error) {
          if (error) return next(error)

          var multi = client.multi()
            , key = req.body.type === 'whitelist' ? 'redsee-whitelist:words:' : 'redsee-blacklist:words:'

          words.forEach(function (word) {
            var hash = XXHash.hash(new Buffer(word), seed)
              , bucket = hash % 500000

            multi.srem(client.prefix + key + bucket, hash)
          })

          multi.exec(function (error, data) {
            if (error) return next(error)

            self.emit('redsee-created:words', words, req.body.type)

            return res.json({ success: sum(data) })
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
