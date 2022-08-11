function Answer () {
  let answers = []

  this.hasAnswer = (nickname) => {
    return answers.findIndex(answer => answer.nickname === nickname) !== -1
  }

  this.getAnswers = () => {
    console.log('List answers')
    return answers
  }

  this.resetRoom = () => {
    console.log('Reset answers')
    answers = []
  }

  this.resetSingle = (nickname) => {
    console.log('Reset answer from team ' + nickname)
    answers = answers.filter(answer => answer.nickname !== nickname)
  }

  this.putAnswer = (answer) => {
    console.log('Answer', answer)
    answers.push(answer)
  }
}

module.exports = Answer
