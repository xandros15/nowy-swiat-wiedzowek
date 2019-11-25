require('dotenv').config()

const PORT = process.env.PORT || 3333
const PASSWORD = process.env.PASSWORD || 'admin'

const io = require('socket.io')(PORT)
let users = []
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
    } else {
      socket.emit('admin', {isSuccess: false})
    }
  })
  socket.on('answer', ({answer, answerAlt}) => {
    console.log(adminIo)
    if (adminIo) {
      adminIo.emit('answer', {
        nickname: user.nickname,
        answer,
        answerAlt
      })
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
