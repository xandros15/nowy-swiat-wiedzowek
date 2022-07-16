function Answer () {
  let answers = []

  this.hasAnswer = (nickname) => {
    return answers.findIndex(answer => answer.nickname === nickname) !== -1
  }

  this.getAnswers = () => {
    return answers
  }

  this.resetRoom = () => {
    console.log(`Reset answers`)
    answers = []
  }

  this.resetSingle = (nickname) => {
    console.log(`Reset user ${answer.nickname} answer`)
    answers = answers.filter(answer => answer.nickname !== nickname)
  }

  this.putAnswer = (answer) => {
    console.log(`User ${answer.nickname} answer ${answer}`)
    answers.push(answer)
  }
}

module.exports = Answer
