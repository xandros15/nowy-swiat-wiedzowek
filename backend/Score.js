function Score () {
  let score = []

  this.getScore = () => {
    console.log('List score')
    return score
  }

  this.reset = () => {
    console.log('Reset score')
    score = []
  }

  this.addPoints = (nickname, points) => {
    console.log('Add ' + points + ' points to ' + nickname)
    const index = score.findIndex(item => item.nickname === nickname)

    if (index !== -1) {
      score[index].points += points
    } else {
      score.push({
        points,
        nickname,
      })
    }
  }

  this.removePoints = (nickname, points) => {
    console.log('Remove ' + points + ' points from ' + nickname)
    const index = score.findIndex(item => item.nickname === nickname)

    if (index !== -1) {
      score[index].points -= points
    } else {
      score.push({
        points: points * -1,
        nickname,
      })
    }
  }
}

module.exports = Score
