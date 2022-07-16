function Score () {
  let score = []

  this.getScore = () => {
    return score
  }

  this.reset = () => {
    score = []
  }

  this.removeTiebreaker = (nickname, points) => {
    console.log(`Remove tiebreaker point for ${nickname}`)
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
    console.log(`Add tiebreaker point for ${nickname}`)
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
    console.log(`Add point for ${nickname}`)
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
    console.log(`Remove point for ${nickname}`)
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
