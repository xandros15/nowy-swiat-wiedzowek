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

  this.removeTiebreaker = (nickname, points) => {
    console.log('Remove ' + points + ' tiebreakers from ' + nickname)
    const index = score.findIndex(item => item.nickname === nickname)

    if (index !== -1) {
      score[index].tiebreaker -= points
    } else {
      score.push({
        tiebreaker: points * -1,
        points: 0,
        nickname,
      })
    }
  }

  this.addTiebreaker = (nickname, points) => {
    console.log('Add ' + points + ' tiebreakers to ' + nickname)
    const index = score.findIndex(item => item.nickname === nickname)

    if (index !== -1) {
      score[index].tiebreaker += points
    } else {
      score.push({
        tiebreaker: points,
        points: 0,
        nickname,
      })
    }
  }

  this.addPoints = (nickname, points) => {
    console.log('Add ' + points + ' points to ' + nickname)
    const index = score.findIndex(item => item.nickname === nickname)

    if (index !== -1) {
      score[index].points += points
    } else {
      score.push({
        tiebreaker: 0,
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
        tiebreaker: 0,
        points: points * -1,
        nickname,
      })
    }
  }
}

module.exports = Score
