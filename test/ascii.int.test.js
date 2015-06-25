var app = require('./bootstrap')
  , request = require('supertest')(app())

describe('ASCII Integration', function () {

  describe('Post', function () {
    it('should return a bad request for no sent data', function (done) {
      request
        .post('/filter/ascii')
        .expect(400)
        .expect('{"error":"missing msg body"}')
        .end(done)
    })

    it('should return a bad request for non array', function (done) {
      request
        .post('/filter/ascii')
        .expect(400)
        .send({ msg: 'test' })
        .expect('{"error":"msg is not an array or is empty"}')
        .end(done)
    })

    it('should return a bad request for an empty array', function (done) {
      request
        .post('/filter/ascii')
        .expect(400)
        .send({ msg: [] })
        .expect('{"error":"msg is not an array or is empty"}')
        .end(done)
    })

    it('should return amount added', function (done) {
      request
        .post('/filter/ascii')
        .expect(200)
        .send({ msg: [ '8===', '(.)(.)' ] })
        .expect('{"success":2}')
        .end(done)
    })

  })

  describe('Delete', function () {
    it('should return a bad request for no sent data', function (done) {
      request
        .delete('/filter/ascii')
        .expect(400)
        .expect('{"error":"missing msg body"}')
        .end(done)
    })

    it('should return a bad request for non array', function (done) {
      request
        .delete('/filter/ascii')
        .expect(400)
        .send({ msg: 'test' })
        .expect('{"error":"msg is not an array or is empty"}')
        .end(done)
    })

    it('should return a bad request for an empty array', function (done) {
      request
        .delete('/filter/ascii')
        .expect(400)
        .send({ msg: [] })
        .expect('{"error":"msg is not an array or is empty"}')
        .end(done)
    })

    it('should return amount of words deleted', function (done) {
      request
        .delete('/filter/ascii')
        .expect(200)
        .send({ msg: [ '8===' ] })
        .expect('{"success":1}')
        .end(done)
    })

  })
})
