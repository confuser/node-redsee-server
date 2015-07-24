var app = require('./bootstrap')
  , request = require('supertest')(app())

describe('Words Integration', function () {

  describe('Post', function () {
    it('should return a bad request for no sent data', function (done) {
      request
        .post('/filter/word')
        .expect(400)
        .expect('{"error":"missing msg body"}')
        .end(done)
    })

    it('should return a bad request for non array', function (done) {
      request
        .post('/filter/word')
        .expect(400)
        .send({ msg: 'test' })
        .expect('{"error":"msg is not an array or is empty"}')
        .end(done)
    })

    it('should return a bad request for an empty array', function (done) {
      request
        .post('/filter/word')
        .expect(400)
        .send({ msg: [] })
        .expect('{"error":"msg is not an array or is empty"}')
        .end(done)
    })

    it('should return a bad request for missing type', function (done) {
      request
        .post('/filter/word')
        .expect(400)
        .send({ msg: [ 'foo' ] })
        .expect('{"error":"missing type"}')
        .end(done)
    })

    it('should return a bad request for invalid type', function (done) {
      request
        .post('/filter/word')
        .expect(400)
        .send({ msg: [ 'foo' ], type: 'red' })
        .expect('{"error":"invalid type"}')
        .end(done)
    })

    it('should return amount of words added', function (done) {
      request
        .post('/filter/word')
        .expect(200)
        .send({ msg: [ 'fuck', 'shit', 'fuck' ], type: 'blacklist' })
        .expect('{"success":28}')
        .end(done)
    })

  })

  describe('Delete', function () {
    it('should return a bad request for no sent data', function (done) {
      request
        .delete('/filter/word')
        .expect(400)
        .expect('{"error":"missing msg body"}')
        .end(done)
    })

    it('should return a bad request for non array', function (done) {
      request
        .delete('/filter/word')
        .expect(400)
        .send({ msg: 'test' })
        .expect('{"error":"msg is not an array or is empty"}')
        .end(done)
    })

    it('should return a bad request for an empty array', function (done) {
      request
        .delete('/filter/word')
        .expect(400)
        .send({ msg: [] })
        .expect('{"error":"msg is not an array or is empty"}')
        .end(done)
    })

    it('should return a bad request for missing type', function (done) {
      request
        .post('/filter/word')
        .expect(400)
        .send({ msg: [ 'foo' ] })
        .expect('{"error":"missing type"}')
        .end(done)
    })

    it('should return a bad request for invalid type', function (done) {
      request
        .post('/filter/word')
        .expect(400)
        .send({ msg: [ 'foo' ], type: 'red' })
        .expect('{"error":"invalid type"}')
        .end(done)
    })

    it('should return amount of words deleted', function (done) {
      request
        .delete('/filter/word')
        .expect(200)
        .send({ msg: [ 'fuck', 'shit', 'fuck' ], type: 'blacklist' })
        .expect('{"success":28}')
        .end(done)
    })

  })
})
