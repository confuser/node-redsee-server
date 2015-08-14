var async = require('async')
  , bypassCombinations = require('./bypass-combinations')
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
    var newWord = word
      , regex = bypassCombinations[i]

    newWord = newWord.replace(regex[0], regex[1])

    if (combinations.indexOf(newWord) === -1) {
      combinations.push(newWord)

      for (var j = 0; j < bypassGroupsLength; j++) {
        var group = bypassGroups[j]
          , firstReplace = newWord.replace(group[0][0], group[0][1])
          , secondReplace = newWord.replace(group[1][0], group[1][1])

        if (firstReplace !== newWord && combinations.indexOf(firstReplace) === -1) combinations.push(firstReplace)
        if (secondReplace !== newWord && combinations.indexOf(secondReplace) === -1) combinations.push(secondReplace)
      }
    }
  }

  return combinations

}
