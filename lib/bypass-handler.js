var bypassCombinations = require('./bypass-combinations')
  , bypassLength = bypassCombinations.length
  , bypassGroups =
    [ [ [ /l/g, 'i' ], [ /i/g, 'l' ] ]
    , [ [ /u/g, 'v' ], [ /v/g, 'u' ] ]
    , [ [ /q/g, 'g' ], [ /g/g, 'q' ] ]
    ]
  , bypassGroupsLength = bypassGroups.length

module.exports = function (word) {
  var combinations = []

  for (var i = 0; i < bypassLength; i++) {
    var regexes = bypassCombinations[i]
      , newWord = word

    for (var j = 0; j < regexes.length; j++) {
      var regex = regexes[j]

      newWord = newWord.replace(regex[0], regex[1])
    }

    if (combinations.indexOf(newWord) === -1) {
      combinations.push(newWord)

      for (var k = 0; k < bypassGroupsLength; k++) {
        var group = bypassGroups[k]
          , firstReplace = newWord.replace(group[0][0], group[0][1])
          , secondReplace = newWord.replace(group[1][0], group[1][1])

        if (firstReplace !== newWord && combinations.indexOf(firstReplace) === -1) combinations.push(firstReplace)
        if (secondReplace !== newWord && combinations.indexOf(secondReplace) === -1) combinations.push(secondReplace)
      }
    }
  }

  return combinations

}
