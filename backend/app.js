require('dotenv').config()

const PORT = process.env.PORT || 3333
const PASSWORD = process.env.PASSWORD || 'admin'

const io = require('socket.io')(PORT)
let users = []
let answers = []
let adminIo = null

io.on('connection', socket => {
  let user = {nickname: '', room: ''}
  socket.on('login', payload => {
    payload = payload || {nickname: '', room: ''}
    const {nickname, room} = payload
    const response = {isSuccess: true, nickname}
    if (users.indexOf(nickname) === -1 &&
      nickname.length > 2 && nickname.length < 16
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
    payload = payload || {password: ''}
    const {password,} = payload
    if (password === PASSWORD && adminIo === null) {
      adminIo = socket
      socket.emit('admin', {isSuccess: true})
      socket.emit('answers.receive', {answers})
    } else {
      socket.emit('admin', {isSuccess: false})
    }
  })
  socket.on('answer', payload => {
    payload = payload || {answer: '', answerAlt: ''}
    const {answer, answerAlt} = payload
    if (
      answer.length < 1 || answer.length > 64 || answerAlt.length > 64 ||
      answers.findIndex(i => i.nickname === user.nickname) !== -1) {
      socket.emit('answer', {isSuccess: false})
    } else {
      const response = {
        room: user.room,
        nickname: user.nickname,
        answer,
        answerAlt
      }
      answers.push(response)
      if (adminIo) {
        adminIo.emit('answer.receive', response)
      }
      socket.emit('answer', {isSuccess: true})
    }
  })
  socket.on('reset', room => {
    if (socket === adminIo) {
      answers = answers.filter(answer => answer.room !== room)
      adminIo.emit('reset.answers', {isSuccess: true})
      io.to(room).emit('reset', {isSuccess: true})
    }
  })
  socket.on('disconnect', () => {
    if (user.nickname.length > 0) {
      users = users.filter(u => u !== user.nickname)
      console.log('disconnect', user.nickname)
    } else if (adminIo === socket) {
      adminIo = null
    }
  })
})

console.log('listening on *:' + PORT)
