function Answer () {
  let answers = []

  this.hasAnswer = (name, room) => {
    return answers.findIndex(answer => answer.nickname === name && answer.room === room) !== -1
  }

  this.getAnswers = (room) => {
    console.log('List answers from ' + room)
    return answers.filter(answer => answer.room === room)
  }

  this.resetRoom = (room) => {
    console.log('Reset answers from room ' + room)
    answers = answers.filter(answer => answer.room !== room)
  }

  this.putAnswer = (answer) => {
    console.log('Answer', answer)
    answers.push(answer)
  }
}

module.exports = Answer
