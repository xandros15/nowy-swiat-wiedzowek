require('dotenv').config()

const PORT = process.env.PORT || 3333
const PASSWORD = process.env.PASSWORD || 'admin'

const io = require('socket.io')(PORT)

io.on('connection', socket => {
  socket.on('disconnect', () => {
  })
})

console.log('listening on *:' + PORT)
