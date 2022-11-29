const Answer = require('./Answer')
const Score = require('./Score')
const Room = require('./Room')

function Rooms () {
  let rooms = []

  this.createEmpty = () => new Room({name: null, owner: null, answers: new Answer(), scores: new Score()})

  this.create = ({name, owner}) => {
    if (this.find(name) === null) {
      const room = new Room({
        name,
        scores: new Score(),
        answers: new Answer(),
        owner
      })
      rooms.push(room)
      return room
    }
  }

  this.remove = room => {
    rooms = rooms.filter(r => r !== room)
  }

  this.score = roomName => {
    const room = this.find(roomName)
    return room ? room.score : new Score()
  }

  this.answers = roomName => {
    const room = this.find(roomName)
    return room ? room.answers : new Answer()
  }

  this.isAvailable = roomName => {
    return this.find(roomName) !== null
  }

  this.exist = roomName => {
    return this.find(roomName) !== null
  }

  this.find = roomName => {
    for (const room of rooms) {
      if (room.name() === roomName) {
        return room
      }
    }
    return null
  }

  this.getOwnerRooms = owner => rooms.filter(room => room.isOwner(owner))
  this.getAllRoomsNames = () => rooms.map(room => room.name())
}

module.exports = Rooms
