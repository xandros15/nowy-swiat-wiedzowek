require('dotenv').config()
const Rooms = require('./Rooms')
const yaml = require('js-yaml')
const fs = require('fs')
const app = require('express')()
const http = require('http').createServer(app)
const PORT = process.env.PORT || 3333

//load yaml
const settings = yaml.safeLoad(fs.readFileSync(__dirname + '/settings.yaml', 'utf8'))
const passwords = settings.passwords
const rooms = new Rooms(settings.rooms)

const origins = (origin, fn) => {
  return fn(null, true)
}

//@todo should add origins as array of domains?
// origins: [
//   'http://localhost:8080',
//   'http://192.168.0.1:8080',
// ],

const io = require('socket.io')(http, {origins})

let users = []

io.on('connection', socket => {
  let user = {nickname: '', room: '', isAdmin: false}
  socket.on('login', payload => {
    payload = payload || {nickname: '', room: ''}
    const {nickname, room} = payload
    const response = {isSuccess: true, nickname}
    if (users.indexOf(nickname) === -1 &&
      nickname.trim().length > 0 && nickname.trim().length < 16 &&
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
      socket.join('score.' + room)
      socket.emit('admin', {isSuccess: true,})
      socket.emit('answers.receive', {answers: rooms.answers(user).getAnswers()})
      socket.emit('score', {score: rooms.score(user).getScore()})
    } else {
      socket.emit('admin', {isSuccess: false})
    }
  })
  socket.on('admin.notify', payload => {
    if (user.isAdmin) {
      io.to(user.room).emit('notification', payload)
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
  socket.on('score', payload => {
    payload = payload || {room: ''}
    const {room,} = payload
    socket.join('score.' + room)
    socket.emit('score', {score: rooms.score({room}).getScore()})
  })
  socket.on('score.add', (nickname, points) => {
    if (user.isAdmin) {
      rooms.score(user).addPoints(nickname, points)
      io.to('score.' + user.room).emit('score', {score: rooms.score(user).getScore()})
    }
  })
  socket.on('score.remove', (nickname, points) => {
    if (user.isAdmin) {
      rooms.score(user).removePoints(nickname, points)
      io.to('score.' + user.room).emit('score', {score: rooms.score(user).getScore()})
    }
  })
  socket.on('tiebreaker.add', (nickname, points) => {
    if (user.isAdmin) {
      rooms.score(user).addTiebreaker(nickname, points)
      io.to('score.' + user.room).emit('score', {score: rooms.score(user).getScore()})
    }
  })
  socket.on('tiebreaker.remove', (nickname, points) => {
    if (user.isAdmin) {
      rooms.score(user).removeTiebreaker(nickname, points)
      io.to('score.' + user.room).emit('score', {score: rooms.score(user).getScore()})
    }
  })
  socket.on('score.reset', () => {
    if (user.isAdmin) {
      rooms.score(user).reset()
      io.to('score.' + user.room).emit('score', {score: rooms.score(user).getScore()})
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

app.get('/resources/rooms.json', function (req, res) {
  res.send(JSON.stringify(settings.rooms))
})

http.listen(PORT, function () {
  console.log('listening on *:' + PORT)
})
