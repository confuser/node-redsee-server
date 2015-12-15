var bootstrap = require('./bootstrap')
  , request

describe('Filter Integration', function () {

  before(function (done) {
    bootstrap(function (error, app) {
      if (error) return done(error)

      request = require('supertest')(app)

      done()
    })
  })

  describe('Post', function () {
    it('should return a bad request for no sent data', function (done) {
      request
        .post('/filter')
        .expect(400)
        .expect('{"error":"missing msg body"}')
        .end(done)
    })

    it('should return a bad request for non string', function (done) {
      request
        .post('/filter')
        .expect(400)
        .send({ msg: [ 'test' ] })
        .expect('{"error":"msg is not a string"}')
        .end(done)
    })

    it('should return a response object', function (done) {
      request
        .post('/filter')
        .expect(200)
        .send({ msg: 'fuck this shit' })
        .expect('{"ascii":[],"phrases":[],"words":[]}')
        .end(done)
    })

  })

})
