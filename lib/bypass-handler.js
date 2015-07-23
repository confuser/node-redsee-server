var bypass =
    [ [ /0/g, 'o' ]
    , [ /1/g, 'i' ]
    , [ /1/g, 'l' ]
    , [ /3/g, 'e' ]
    , [ /5/g, 's' ]
    , [ /\$/g, 's' ]
    , [ /\£/g, 'e' ]
    , [ /\£/g, 's' ]
    , [ /\(/g, 'c' ]
    , [ /[\W_]+/g, ' ' ]
    ]
  , bypassGroups =
    [ [ [ /l/g, 'i' ], [ /i/g, 'l' ] ]
    , [ [ /u/g, 'v' ], [ /v/g, 'u' ] ]
    , [ [ /q/g, 'g' ], [ /g/g, 'q' ] ]
    ]

module.exports = function (word) {
  var newWord = word
    , combinations = []

  bypass.forEach(function (regex) {
    newWord = newWord.replace(regex[0], regex[1])
  })

  combinations.push(newWord)

  bypassGroups.forEach(function (group) {
    var firstReplace = newWord.replace(group[0][0], group[0][1])
      , secondReplace = newWord.replace(group[1][0], group[1][1])

    if (firstReplace !== newWord && combinations.indexOf(firstReplace) === -1) combinations.push(firstReplace)
    if (secondReplace !== newWord && combinations.indexOf(firstReplace) === -1) combinations.push(secondReplace)
  })

  return combinations
}
