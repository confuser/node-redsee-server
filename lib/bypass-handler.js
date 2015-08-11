var powersetStream = require('powerset-stream')
  , bypass =
    [ [ /o/g, '0' ]
    , [ /i/g, '1' ]
    , [ /l/g, '1' ]
    , [ /e/g, '3' ]
    , [ /s/g, '5' ]
    , [ /s/g, '$' ]
    , [ /t/g, '7' ]
    , [ /e/g, '£' ]
    , [ /s/g, '£' ]
    , [ /c/g, '(' ]
    , [ /i/, '!' ]
    , [ /t/, '!' ]
    // , [ /[\W_]+/g, ' ' ]
    ]
  , bypassGroups =
    [ [ [ /l/g, 'i' ], [ /i/g, 'l' ] ]
    , [ [ /u/g, 'v' ], [ /v/g, 'u' ] ]
    , [ [ /q/g, 'g' ], [ /g/g, 'q' ] ]
    ]

module.exports = function (word, callback) {
  var combinations = []

  powersetStream(bypass).on('data', function (comb) {
    var newWord = word

    comb.forEach(function (regex) {
      newWord = newWord.replace(regex[0], regex[1])
    })

    if (combinations.indexOf(newWord) === -1) {
      combinations.push(newWord)

      bypassGroups.forEach(function (group) {
        var firstReplace = newWord.replace(group[0][0], group[0][1])
          , secondReplace = newWord.replace(group[1][0], group[1][1])

        if (firstReplace !== newWord && combinations.indexOf(firstReplace) === -1) combinations.push(firstReplace)
        if (secondReplace !== newWord && combinations.indexOf(secondReplace) === -1) combinations.push(secondReplace)
      })
    }
  })
  .on('error', callback)
  .on('end', function () {
    callback(null, combinations)
  })

  return combinations
}
