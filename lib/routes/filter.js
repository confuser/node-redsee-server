var XXHash = require('xxhash')
  , seed = 0xCAFEBABE // This may need to change, based on xxhash docs

module.exports = function (client, filter) {

  return function (req, res, next) {

    if (!req.body.msg) return res.status(400).json({ error: 'missing msg body' })
    if (typeof req.body.msg !== 'string') return res.status(400).json({ error: 'msg is not a string' })

    var hash = XXHash.hash(new Buffer(req.body.msg), seed)

    // Ah pyramid, refactor to use async series
    client.get('redsee-cache:filter:' + hash, function (error, cachedRes) {
      if (error) return next(error)
      if (cachedRes) return res.json(JSON.parse(cachedRes))

      filter(client, req.body.msg, function (error, response) {
        if (error) return next(error)

        client.set('redsee-cache:filter:' + hash, JSON.stringify(response), function (error) {
          if (error) return next(error)

          client.sadd([ 'redsee-cache:filter:keys' ].concat(hash), function (error) {
            if (error) return next(error)

            res.json(response)
          })

        })
      })
    })
  }
}
