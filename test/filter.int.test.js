var app = require('./bootstrap')()
  , request = require('supertest')(app)
  , assert = require('assert')
  , XXHash = require('xxhash')
  , seed = 0xCAFEBABE // This may need to change, based on xxhash docs

describe('Filter Integration', function () {

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

    it('should cache the response for speed', function (done) {
      var msg = 'fuck this shit'
        , hash = XXHash.hash(new Buffer(msg), seed)

      request
        .post('/filter')
        .expect(200)
        .send({ msg: msg })
        .expect('{"ascii":[],"phrases":[],"words":[]}')
        .end(function (error) {
          if (error) return done(error)

          app.redisClient.get('testredsee-cache:filter:' + hash, function (error, res) {
            if (error) return done(error)

            app.redisClient.del('testredsee-cache:filter:' + hash)

            var expected =
            { ascii: [ ]
            , phrases: [ ]
            , words: [ ]
            }

          assert.deepEqual(JSON.parse(res), expected)

          done()
        })
      })

    })
  })

})
