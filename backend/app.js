require('dotenv').config()
const Rooms = require('./Rooms')

const PORT = process.env.PORT || 3333
// old code
// const PASSWORD = process.env.PASSWORD || 'admin'

const passwords = {
  'nami': process.env.PASSWORD_NAMI,
  'xmascon': process.env.PASSWORD_XMASS,
  'remcon': process.env.PASSWORD_REM,
}

const rooms = new Rooms(Object.keys(passwords))

const io = require('socket.io')(PORT)
let users = []

io.on('connection', socket => {
  let user = {nickname: '', room: '', isAdmin: false}
  socket.on('login', payload => {
    payload = payload || {nickname: '', room: ''}
    const {nickname, room} = payload
    const response = {isSuccess: true, nickname}
    if (users.indexOf(nickname) === -1 &&
      nickname.length > 0 && nickname.length < 16 &&
      rooms.isAvailable(room)
    ) {
      socket.join(room)
      user.room = room
      user.nickname = nickname
      users.push(nickname)
    } else {
      response.isSuccess = false
    }
    socket.emit('login', response)
    console.log('login', response)
  })
  socket.on('admin', payload => {
    payload = payload || {password: '', room: ''}
    const {password, room,} = payload
    if (passwords[room] && password === passwords[room]) {
      user.isAdmin = true
      user.room = room
      socket.join('admin.' + room)
      socket.emit('admin', {isSuccess: true,})
      socket.emit('answers.receive', {answers: rooms.answers(user).getAnswers()})
      socket.emit('score', {score: rooms.score(user).getScore()})
    } else {
      socket.emit('admin', {isSuccess: false})
    }
  })
  socket.on('answer', payload => {
    payload = payload || {answer: '', answerAlt: ''}
    const {answer, answerAlt} = payload
    if (
      answer.length < 1 || answer.length > 64 || answerAlt.length > 64 ||
      rooms.answers(user).hasAnswer(user.nickname)
    ) {
      socket.emit('answer', {isSuccess: false})
    } else {
      const response = {
        nickname: user.nickname,
        answer,
        answerAlt
      }
      rooms.answers(user).putAnswer(response)
      io.to('admin.' + user.room).emit('answer.receive', response)
      socket.emit('answer', {isSuccess: true})
    }
  })
  socket.on('score', () => {
    io.to('admin.' + user.room).emit('score', {score: rooms.score(user).getScore()})
  })
  socket.on('score.add', (nickname, points) => {
    if (user.isAdmin) {
      rooms.score(user).addPoints(nickname, points)
      io.to('admin.' + user.room).emit('score', {score: rooms.score(user).getScore()})
    }
  })
  socket.on('score.remove', (nickname, points) => {
    if (user.isAdmin) {
      rooms.score(user).removePoints(nickname, points)
      io.to('admin.' + user.room).emit('score', {score: rooms.score(user).getScore()})
    }
  })
  socket.on('score.reset', () => {
    if (user.isAdmin) {
      rooms.score(user).reset()
      io.to('admin.' + user.room).emit('score', {score: []})
    }
  })
  socket.on('reset', () => {
    if (user.isAdmin) {
      rooms.answers(user).resetRoom()
      io.to('admin.' + user.room).emit('reset.answers', {isSuccess: true})
      io.to(user.room).emit('reset', {isSuccess: true})
    }
  })
  socket.on('reset.single', (nickname) => {
    if (user.isAdmin && typeof nickname === 'string') {
      rooms.answers(user).resetSingle(nickname)
      io.to('admin.' + user.room).emit('reset.single', {isSuccess: true, nickname})
    }
  })
  socket.on('disconnect', () => {
    if (user.nickname.length > 0) {
      users = users.filter(u => u !== user.nickname)
      console.log('disconnect', user.nickname)
    }
  })
})

console.log('listening on *:' + PORT)
