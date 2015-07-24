var assert = require('assert')
  , bypassHandler = require('../lib/bypass-handler')

describe('Bypass Handler', function () {

  it('handle all replacements', function (done) {
    var expected =
      [ 'venice'
      , 'venlce'
      , 'uenice'
      , 'ven1ce'
      , 'uen1ce'
      , 'v3nic3'
      , 'v3nlc3'
      , 'u3nic3'
      , 'v£nic£'
      , 'v£nlc£'
      , 'u£nic£'
      , 'veni(e'
      , 'venl(e'
      , 'ueni(e'
      , 'v3n1c3'
      , 'u3n1c3'
      , 'v£n1c£'
      , 'u£n1c£'
      , 'ven1(e'
      , 'uen1(e'
      , 'v3ni(3'
      , 'v3nl(3'
      , 'u3ni(3'
      , 'v£ni(£'
      , 'v£nl(£'
      , 'u£ni(£'
      , 'v3n1(3'
      , 'u3n1(3'
      , 'v£n1(£'
      , 'u£n1(£'
      ]

    bypassHandler('venice', function (error, combinations) {
      if (error) return done(error)

      assert.deepEqual(combinations, expected)

      done()
    })
  })

})