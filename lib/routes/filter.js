module.exports = function (client, filter) {

  return function (req, res, next) {

    if (!req.body.msg) return res.status(400).json({ error: 'missing msg body' })
    if (typeof req.body.msg !== 'string') return res.status(400).json({ error: 'msg is not a string' })

    filter(client, req.body.msg, function (error, response) {
      if (error) return next(error)

      res.json(response)
    })
  }
}
