const Answer = require('./Answer')
const Score = require('./Score')

function Rooms (rooms) {
  const score = {}
  const answer = {}

  for (const room of rooms) {
    score[room] = new Score()
    answer[room] = new Answer()
  }

  this.score = user => {
    if (score[user.room]) {
      return score[user.room]
    }
    return new Score()
  }
  this.answers = user => {
    if (answer[user.room]) {
      return answer[user.room]
    }
    return new Answer()
  }

  this.isAvailable = room => {
    return rooms.indexOf(room) !== -1
  }
}

module.exports = Rooms
