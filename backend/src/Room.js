function Room ({name, scores, answers, owner, takeovers}) {
  const room = {
    name: name,
    scores: scores,
    answers: answers,
    owner: owner,
    takeovers: takeovers,
  }

  this.name = () => room.name
  this.getScore = () => room ? room.scores.getScore() : false
  this.resetScore = () => room ? room.scores.reset() : false
  this.removeTiebreaker = (nickname, points) => room ? room.scores.removeTiebreaker(nickname, points) : false
  this.addTiebreaker = (nickname, points) => room ? room.scores.addTiebreaker(nickname, points) : false
  this.addPoints = (nickname, points) => room ? room.scores.addPoints(nickname, points) : false
  this.removePoints = (nickname, points) => room ? room.scores.removePoints(nickname, points) : false

  this.hasAnswer = nickname => room ? room.answers.hasAnswer(nickname) : false
  this.getAnswers = () => room ? room.answers.getAnswers() : false
  this.resetAnswers = () => room ? room.answers.resetRoom() : false
  this.resetSingleAnswer = nickname => room ? room.answers.resetSingle(nickname) : false
  this.putAnswer = answer => room ? room.answers.putAnswer(answer) : false

  this.isOwner = ownerId => room.owner === ownerId

  this.takeover = nickname => room ? room.takeovers.takeover(nickname) : false
  this.getTakeovers = () => room ? room.takeovers.getList() : []
  this.resetTakeover = () => room ? room.takeovers.reset() : false
  this.hasTakeover = nickname => room ? room.takeovers.hasTakeover(nickname) : false
}

module.exports = Room
