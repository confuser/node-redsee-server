var app = require('./bootstrap')
  , request = require('supertest')(app())

describe('Email Integration', function () {

  describe('Post', function () {
    it('should return a bad request for no sent data', function (done) {
      request
        .post('/filter/email')
        .expect(400)
        .expect('{"error":"missing msg body"}')
        .end(done)
    })

    it('should return a bad request for non array', function (done) {
      request
        .post('/filter/email')
        .expect(400)
        .send({ msg: 'test' })
        .expect('{"error":"msg is not an array or is empty"}')
        .end(done)
    })

    it('should return a bad request for an empty array', function (done) {
      request
        .post('/filter/email')
        .expect(400)
        .send({ msg: [] })
        .expect('{"error":"msg is not an array or is empty"}')
        .end(done)
    })

    it('should not allow invalid emails', function (done) {
      request
        .post('/filter/email')
        .expect(400)
        .send({ msg: [ 'foo' ] })
        .expect('{"error":"invalid emails"}')
        .end(done)
    })

    it('should return amount of addresses added', function (done) {
      request
        .post('/filter/email')
        .expect(200)
        .send({ msg: [ 'test@tst.com', 'test@test.com', 'test@tst.com' ] })
        .expect('{"success":2}')
        .end(done)
    })

  })

  describe('Delete', function () {
    it('should return a bad request for no sent data', function (done) {
      request
        .delete('/filter/email')
        .expect(400)
        .expect('{"error":"missing msg body"}')
        .end(done)
    })

    it('should return a bad request for non array', function (done) {
      request
        .delete('/filter/email')
        .expect(400)
        .send({ msg: 'test' })
        .expect('{"error":"msg is not an array or is empty"}')
        .end(done)
    })

    it('should return a bad request for an empty array', function (done) {
      request
        .delete('/filter/email')
        .expect(400)
        .send({ msg: [] })
        .expect('{"error":"msg is not an array or is empty"}')
        .end(done)
    })

    it('should return amount of addresses deleted', function (done) {
      request
        .delete('/filter/email')
        .expect(200)
        .send({ msg: [ 'test@tst.com', 'test@test.com', 'test@tst.com' ] })
        .expect('{"success":2}')
        .end(done)
    })

  })
})
