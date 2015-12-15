var bootstrap = require('./bootstrap')
  , request

describe('Phrases Integration', function () {

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
        .post('/filter/phrase')
        .expect(400)
        .expect('{"error":"missing msg body"}')
        .end(done)
    })

    it('should return a bad request for non array', function (done) {
      request
        .post('/filter/phrase')
        .expect(400)
        .send({ msg: 'test' })
        .expect('{"error":"msg is not an array or is empty"}')
        .end(done)
    })

    it('should return a bad request for an empty array', function (done) {
      request
        .post('/filter/phrase')
        .expect(400)
        .send({ msg: [] })
        .expect('{"error":"msg is not an array or is empty"}')
        .end(done)
    })

    it('should return a bad request for missing type', function (done) {
      request
        .post('/filter/phrase')
        .expect(400)
        .send({ msg: [ 'foo' ] })
        .expect('{"error":"missing type"}')
        .end(done)
    })

    it('should return a bad request for invalid type', function (done) {
      request
        .post('/filter/phrase')
        .expect(400)
        .send({ msg: [ 'foo' ], type: 'red' })
        .expect('{"error":"invalid type"}')
        .end(done)
    })

    it('should return success if phrases added', function (done) {
      request
        .post('/filter/phrase')
        .expect(200)
        .send({ msg: [ 'fuck you', 'shit this', 'fuck you' ], type: 'blacklist' })
        .expect('{"success":true}')
        .end(done)
    })

  })

  describe('Delete', function () {
    it('should return a bad request for no sent data', function (done) {
      request
        .delete('/filter/phrase')
        .expect(400)
        .expect('{"error":"missing msg body"}')
        .end(done)
    })

    it('should return a bad request for non array', function (done) {
      request
        .delete('/filter/phrase')
        .expect(400)
        .send({ msg: 'test' })
        .expect('{"error":"msg is not an array or is empty"}')
        .end(done)
    })

    it('should return a bad request for an empty array', function (done) {
      request
        .delete('/filter/phrase')
        .expect(400)
        .send({ msg: [] })
        .expect('{"error":"msg is not an array or is empty"}')
        .end(done)
    })

    it('should return a bad request for missing type', function (done) {
      request
        .post('/filter/phrase')
        .expect(400)
        .send({ msg: [ 'foo' ] })
        .expect('{"error":"missing type"}')
        .end(done)
    })

    it('should return a bad request for invalid type', function (done) {
      request
        .post('/filter/phrase')
        .expect(400)
        .send({ msg: [ 'foo' ], type: 'red' })
        .expect('{"error":"invalid type"}')
        .end(done)
    })

    it('should return success if words deleted', function (done) {
      request
        .delete('/filter/phrase')
        .expect(200)
        .send({ msg: [ 'fuck you', 'shit this', 'fuck you' ], type: 'blacklist' })
        .expect('{"success":true}')
        .end(done)
    })

  })
})
