const validateNickname = nickname => {
  if (typeof nickname !== 'string') {
    return false
  }

  if (nickname.trim().length < 1 || nickname.length > 16) {
    return false
  }

  return !/[\u2000-\u3000]/.test(nickname)//if hasn't cheat whitespace
}

function Score() {
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
    } else if (validateNickname(nickname)) {
      score.push({
        number: getNextNumber(),
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
        number: getNextNumber(),
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
    } else if (validateNickname(nickname)) {
      score.push({
        number: getNextNumber(),
        tiebreaker: 0,
        points,
        nickname,
      })
    }
  }

  this.removeNickname = (nickname) => {
    console.log('Remove ' + nickname + ' nickname from scoreboard')
    const index = score.findIndex(item => item.nickname === nickname)
    if (index !== -1) {
      score = score.filter(s => s.nickname !== nickname)
    }
  }

  this.removePoints = (nickname, points) => {
    console.log('Remove ' + points + ' points from ' + nickname)
    const index = score.findIndex(item => item.nickname === nickname)

    if (index !== -1) {
      score[index].points -= points
    } else if (validateNickname(nickname)) {
      score.push({
        number: getNextNumber(),
        tiebreaker: 0,
        points: points * -1,
        nickname,
      })
    }
  }

  function getNextNumber() {
    let next = 1;
    for(const single of score){
      if(single.number >= next){
        next = single.number + 1
      }
    }
    return next;
  }
}

module.exports = Score
