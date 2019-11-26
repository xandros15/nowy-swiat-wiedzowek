require('dotenv').config()

const PORT = process.env.PORT || 3333
const PASSWORD = process.env.PASSWORD || 'admin'

const io = require('socket.io')(PORT)
let users = []
let answers = []
let adminIo = null

io.on('connection', socket => {
  let user = {nickname: '',}
  socket.on('login', ({nickname}) => {
    const payload = {isSuccess: true, nickname}
    if (users.indexOf(nickname) === -1) {
      user.nickname = nickname
      users.push(nickname)
    } else {
      payload.isSuccess = false
    }
    socket.emit('login', payload)
    console.log('login', payload)
  })
  socket.on('admin', ({password}) => {
    if (password === PASSWORD) {
      adminIo = socket
      socket.emit('admin', {isSuccess: true})
      socket.emit('answers', {answers})
    } else {
      socket.emit('admin', {isSuccess: false})
    }
  })
  socket.on('answer', ({answer, answerAlt}) => {
    const payload = {
      nickname: user.nickname,
      answer,
      answerAlt
    }
    answers.push(payload)
    if (adminIo) {
      adminIo.emit('answer', payload)
    }
  })
  socket.on('reset', () => {
    if (socket === adminIo) {
      answers = []
      adminIo.emit('reset', {isSuccess: true})
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