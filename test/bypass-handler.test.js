var assert = require('assert')
  , bypassHandler = require('../lib/bypass-handler')

describe('Bypass Handler', function () {

  it('handle all replacements', function () {
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
      , 'ven!ce'
      , 'uen!ce'
      , 'v3n1c3'
      , 'u3n1c3'
      , 'v£n1c£'
      , 'u£n1c£'
      , 'ven1(e'
      , 'uen1(e'
      , 'v3ni(3'
      , 'v3nl(3'
      , 'u3ni(3'
      , 'v3n!c3'
      , 'u3n!c3'
      , 'v£ni(£'
      , 'v£nl(£'
      , 'u£ni(£'
      , 'v£n!c£'
      , 'u£n!c£'
      , 'ven!(e'
      , 'uen!(e'
      , 'v3n1(3'
      , 'u3n1(3'
      , 'v£n1(£'
      , 'u£n1(£'
      , 'v3n!(3'
      , 'u3n!(3'
      , 'v£n!(£'
      , 'u£n!(£'
      ]
      , combinations = bypassHandler('venice')

    assert.deepEqual(combinations, expected)

  })

})
