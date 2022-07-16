function Answer () {
  let answers = []

  this.hasAnswer = (nickname) => {
    return answers.findIndex(answer => answer.nickname === nickname) !== -1
  }

  this.getAnswers = () => {
    return answers
  }

  this.resetRoom = () => {
    answers = []
  }

  this.resetSingle = (nickname) => {
    answers = answers.filter(answer => answer.nickname !== nickname)
  }

  this.putAnswer = (answer) => {
    answers.push(answer)
  }
}

module.exports = Answer
