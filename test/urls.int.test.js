var bootstrap = require('./bootstrap')
  , request

describe('Url Integration', function () {

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
        .post('/filter/url')
        .expect(400)
        .expect('{"error":"missing msg body"}')
        .end(done)
    })

    it('should return a bad request for non array', function (done) {
      request
        .post('/filter/url')
        .expect(400)
        .send({ msg: 'test' })
        .expect('{"error":"msg is not an array or is empty"}')
        .end(done)
    })

    it('should return a bad request for an empty array', function (done) {
      request
        .post('/filter/url')
        .expect(400)
        .send({ msg: [] })
        .expect('{"error":"msg is not an array or is empty"}')
        .end(done)
    })

    it('should return success if urls added', function (done) {
      request
        .post('/filter/url')
        .expect(200)
        .send({ msg: [ 'https://google.com', '*.frostcast.net', '*.frostcast.net' ] })
        .expect('{"success":true}')
        .end(done)
    })

    it('should not allow invalid urls', function (done) {
      request
        .post('/filter/url')
        .expect(400)
        .send({ msg: [ 'foo' ] })
        .expect('{"error":"invalid urls"}')
        .end(done)
    })

  })

  describe('Delete', function () {
    it('should return a bad request for no sent data', function (done) {
      request
        .delete('/filter/url')
        .expect(400)
        .expect('{"error":"missing msg body"}')
        .end(done)
    })

    it('should return a bad request for non array', function (done) {
      request
        .delete('/filter/url')
        .expect(400)
        .send({ msg: 'test' })
        .expect('{"error":"msg is not an array or is empty"}')
        .end(done)
    })

    it('should return a bad request for an empty array', function (done) {
      request
        .delete('/filter/url')
        .expect(400)
        .send({ msg: [] })
        .expect('{"error":"msg is not an array or is empty"}')
        .end(done)
    })

    it('should return success if urls deleted', function (done) {
      request
        .delete('/filter/url')
        .expect(200)
        .send({ msg: [ 'https://google.com', '*.frostcast.net', '*.frostcast.net' ] })
        .expect('{"success":true}')
        .end(done)
    })

  })
})
