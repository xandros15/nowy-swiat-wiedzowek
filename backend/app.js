require('dotenv').config()
const Rooms = require('./src/Rooms')
const Oauth2 = require('./src/oauth2')
const jwt_decode = require('jwt-decode')
const app = require('express')()
const http = require('http').createServer(app)
const {Server} = require('socket.io')
const PORT = process.env.PORT_BACKEND || 80

const oauth = new Oauth2({
  client_id: process.env.OAUTH2_CLIENT,
  client_secret: process.env.OAUTH2_SECRET,
  redirect_uri: process.env.OAUTH2_REDIRECT,
  auth_url: process.env.OAUTH2_AUTH_URL,
  token_url: process.env.OAUTH2_TOKEN_URL,
  userinfo_url: process.env.OIDC_USERINFO_URL,
  scopes: ['openid', 'email', 'profile'],
})
const debug = process.env.DEBUG || false

//repo
const rooms = new Rooms()

const yaml = require('js-yaml')
const fs = require('fs')
const LegacyKeyring = require('./src/LegacyKeyring')
const keyRoomsFile = __dirname + '/rooms.yml';
const keyRooms = fs.existsSync(keyRoomsFile) ? yaml.safeLoad(fs.readFileSync(keyRoomsFile, 'utf8')) : []
const legacyKeyring = new LegacyKeyring(keyRooms)
legacyKeyring.getRooms().forEach(roomName => {
  rooms.create({
    name: roomName,
    owner: roomName + '@quiz.local',
  })
})

const io = new Server(http, {
  cors: {
    origin: '*',
  }
})

let users = []

const validateNickname = nickname => {
  if (typeof nickname !== 'string') {
    return false
  }

  if (nickname.trim().length < 1 || nickname.length > 16) {
    return false
  }

  return !/[\u2000-\u3000]/.test(nickname)//if hasn't cheat whitespace
}

const validateAnswer = payload => {
  return payload.answer.length > 0 &&
    payload.answer.length <= 64 &&
    payload.answerAlt.length <= 64
}

const removeRoom = roomname => {
  io.socketsLeave('admin.' + roomname)
  io.socketsLeave('score.' + roomname)
  io.socketsLeave(roomname)
}

const adminRoutes = [
  'admin.notify',
  'admin.room.join',
  'admin.room.create',
  'admin.room.remove',
  'score.add',
  'score.remove',
  'score.reset',
  'tiebreaker.add',
  'tiebreaker.remove',
  //answers
  'reset',
  'reset.single',
  //takeovers
  'takeover.reset',
]

io.on('connection', socket => {
  socket.data = {
    nickname: '',
    roomname: '',
    isAdmin: false,
    email: '',//if admin
    username: '',//if admin
    room: rooms.createEmpty()//empty room
  }
  socket.use(([event, ...args], next) => { //debug
    if (
      adminRoutes.indexOf(event) !== -1
      && !socket.data.isAdmin
    ) {
      socket.emit('error', {code: 'FORBIDDEN'})
      return
    }
    next()
  })
  socket.use(([event, ...args], next) => { //debug
    if (debug) {
      console.log({event, args,})
      next()
    }
  })
  socket.use(([event, ...args], next) => { //pokemon-catch
    try {
      next()
    } catch (e) {
      console.error(e)
      socket.emit('error', {code: 'SERVER_ERROR'})
    }
  })

  //auth
  socket.on('legacy.admin', payload => {
    const roomName = payload.room
    const password = payload.password
    if (
        !roomName
        || typeof roomName !== 'string'
        || !password
        || typeof password !== 'string'
    ) {
      socket.emit('admin', {isSuccess: false, code: 'INVALID_PAYLOAD',})
      return
    }
    if (!legacyKeyring.hasRoom(roomName)) {
      socket.emit('admin', {isSuccess: false, code: 'ROOM_NO_EXISTS',})
      return
    }
    if (!legacyKeyring.isCorrectKey(password, roomName)) {
      socket.emit('admin', {isSuccess: false, code: 'FORBIDDEN',})
      return
    }

    socket.data.isAdmin = true
    socket.data.email = roomName + '@quiz.local'
    socket.data.username = roomName
    socket.data.room = rooms.find(roomName)
    socket.join('admin.' + roomName)
    socket.join('score.' + roomName)
    socket.emit('admin', {isSuccess: true, legacy: true})
    socket.emit('answers.receive', {answers: socket.data.room.getAnswers()})
    socket.emit('score', {score: socket.data.room.getScore()})
    socket.emit('takeover.list', {takeovers: socket.data.room.getTakeovers()})
  })

  socket.on('authenticate.code', async (code) => {
    try {
      const tokens = await oauth.byCode(code)
      if (tokens !== false) {//login
        const jwt = jwt_decode(tokens.id_token)
        socket.data.isAdmin = true
        socket.data.email = jwt.email
        socket.data.username = jwt.username
        socket.emit('admin.rooms', rooms.getOwnerRooms(jwt.email).map(room => room.name()))
      }
      socket.emit('authenticate.code', tokens)
    } catch (e) {
    }
  })
  socket.on('authenticate.refresh_token', async (refresh_token) => {
    try {
      const tokens = await oauth.byRefresh(refresh_token)
      if (tokens !== false) {//login
        socket.data.isAdmin = true
        socket.data.email = tokens.userinfo.email
        socket.data.username = tokens.userinfo.username
        socket.emit('admin.rooms', rooms.getOwnerRooms(tokens.userinfo.email).map(room => room.name()))
      }
      socket.emit('authenticate.refresh_token', tokens)
    } catch (e) {}
  })
  socket.on('authenticate.fetch_url', async () => {
    const url = await oauth.getAuthUrl()
    socket.emit('authenticate.url', url)
  })
  //admin
  socket.on('admin.room.remove', payload => {
    if (!payload.room || typeof payload.room !== 'string') {
      socket.emit('admin.room.remove', {isSuccess: false, code: 'INVALID_PAYLOAD',})
      return
    }
    if (!/^[\w-]{3,16}$/.test(payload.room)) {
      socket.emit('admin.room.remove', {isSuccess: false, code: 'INVALID_ROOMNAME',})
      return
    }
    const room = rooms.find(payload.room)

    if (room === null || !room.isOwner(socket.data.email)) {
      socket.emit('admin.room.remove', {isSuccess: false, code: 'FORBIDDEN',})
      return
    }
    rooms.remove(room)
    socket.emit('admin.room.remove', {roomname: room.name()})
    io.to(room.name()).emit('room.remove', {roomname: room.name()})
    removeRoom(room.name())
    socket.emit('admin.rooms', rooms.getOwnerRooms(socket.data.email).map(r => r.name()))
    io.emit('rooms', rooms.getAllRoomsNames()) //@todo improve it to not send everywhere
  })
  socket.on('admin.room.create', payload => {
    if (!payload.room || typeof payload.room !== 'string') {
      socket.emit('admin.room.create', {isSuccess: false})
      return
    }
    if (!/^[\w-]{3,16}$/.test(payload.room)) {
      socket.emit('admin.room.create', {isSuccess: false})
      return
    }
    if (rooms.exist(payload.room)) {
      socket.emit('admin.room.create', {isSuccess: false})
      return
    }
    const room = rooms.create({
      name: payload.room,
      owner: socket.data.email,
    })
    socket.emit('admin.room.create', {isSuccess: true, room: {name: room.name()}})
    socket.emit('admin.rooms', rooms.getOwnerRooms(socket.data.email).map(room => room.name()))
    io.emit('rooms', rooms.getAllRoomsNames()) //@todo improve it to not send everywhere
  })

  socket.on('admin.room.join', payload => {
    const roomName = payload.room
    if (!roomName || typeof roomName !== 'string') {
      socket.emit('admin.room.join', {isSuccess: false, code: 'INVALID_PAYLOAD',})
      return
    }
    const room = rooms.find(roomName)
    if (!room) {
      socket.emit('admin.room.join', {isSuccess: false, code: 'ROOM_NO_EXISTS',})
      return
    }
    if (!room.isOwner(socket.data.email)) {
      socket.emit('admin.room.join', {isSuccess: false, code: 'FORBIDDEN',})
      return
    }

    socket.data.room = room
    socket.join('admin.' + roomName)
    socket.join('score.' + roomName)
    socket.emit('admin', {isSuccess: true,})
    socket.emit('answers.receive', {answers: socket.data.room.getAnswers()})
    socket.emit('score', {score: socket.data.room.getScore()})
    socket.emit('takeover.list', {takeovers: socket.data.room.getTakeovers()})
  })
  socket.on('admin.notify', payload => {
    if (socket.data.isAdmin) {
      io.to(socket.data.room.name()).emit('notification', payload)
    }
  })

  socket.on('score.add', (nickname, points) => {
    if (socket.data.isAdmin) {
      socket.data.room.addPoints(nickname, points)
      io.to('score.' + socket.data.room.name()).emit('score', {score: socket.data.room.getScore()})
    }
  })
  socket.on('score.remove', (nickname, points) => {
    if (socket.data.isAdmin) {
      socket.data.room.removePoints(nickname, points)
      io.to('score.' + socket.data.room.name()).emit('score', {score: socket.data.room.getScore()})
    }
  })
  socket.on('tiebreaker.add', (nickname, points) => {
    if (socket.data.isAdmin) {
      socket.data.room.addTiebreaker(nickname, points)
      io.to('score.' + socket.data.room.name()).emit('score', {score: socket.data.room.getScore()})
    }
  })
  socket.on('tiebreaker.remove', (nickname, points) => {
    if (socket.data.isAdmin) {
      socket.data.room.removeTiebreaker(nickname, points)
      io.to('score.' + socket.data.room.name()).emit('score', {score: socket.data.room.getScore()})
    }
  })
  socket.on('score.reset', () => {
    if (socket.data.isAdmin) {
      socket.data.room.resetScore()
      io.to('score.' + socket.data.room.name()).emit('score', {score: socket.data.room.getScore()})
    }
  })
  socket.on('score.nickname.remove', (nickname) => {
    if (socket.data.isAdmin) {
      socket.data.room.removeNickname(nickname)
      io.to('score.' + socket.data.room.name()).emit('score', {score: socket.data.room.getScore()})
    }
  })
  socket.on('reset', () => {
    if (socket.data.isAdmin) {
      socket.data.room.resetAnswers()
      io.to('admin.' + socket.data.room.name()).emit('reset.answers', {isSuccess: true})
      io.to(socket.data.room.name()).emit('reset', {isSuccess: true})
    }
  })
  socket.on('reset.single', (nickname) => {
    if (socket.data.isAdmin && typeof nickname === 'string') {
      socket.data.room.resetSingleAnswer(nickname)
      io.to('admin.' + socket.data.room.name()).emit('reset.single', {isSuccess: true, nickname})
    }
  })
  //takeover
  socket.on('takeover', () => {
    if (!socket.data.room || !socket.data.nickname) {
      socket.emit('notification', {message: 'ERROR_USER_NO_SET', type: 'error'})
      socket.emit('socket.data.kick')

      return
    }

    const takeover = socket.data.room.takeover(socket.data.nickname)
    if (takeover === false) {
      socket.emit('takeover', {isSuccess: false})
      return
    }
    io.to('admin.' + socket.data.room.name()).emit('takeover.list', {takeovers: socket.data.room.getTakeovers()})
    socket.emit('takeover', {takeover, isSuccess: true})
    console.log('User takeover', {takeover})
  })
  socket.on('takeover.reset', () => {
    socket.data.room.resetTakeover()
    io.to(socket.data.room.name()).emit('takeover.reset')
    console.log('Reset takeover')
  })

  //users
  socket.on('answer', payload => {
    payload = payload || {answer: '', answerAlt: ''}
    if (!socket.data.room || !socket.data.nickname) {
      socket.emit('notification', {message: 'ERROR_USER_NO_SET', type: 'error'})
      socket.emit('socket.data.kick')

      return
    }
    if (!validateAnswer(payload) || socket.data.room.hasAnswer(socket.data.nickname)) {
      socket.emit('answer', {isSuccess: false})

      return
    }

    const answer = {
      nickname: socket.data.nickname,
      answer: payload.answer,
      answerAlt: payload.answerAlt,
    }
    socket.data.room.putAnswer(answer)
    io.to('admin.' + socket.data.room.name()).emit('answer.receive', answer)
    socket.emit('answer', {isSuccess: true})
  })
  socket.on('login', payload => {
    const roomname = payload.room || ''
    let nickname = payload.nickname || ''
    if (!validateNickname(nickname)) {
      socket.emit('login', {isSuccess: false, nickname, code: 'ERROR_INVALID_NICKNAME'})
      return
    }
    nickname = nickname.trim()
    if (users.indexOf(nickname) !== -1) {
      socket.emit('login', {isSuccess: false, nickname, code: 'ERROR_USER_EXISTS'})
      return
    }

    if (!rooms.isAvailable(roomname)) {
      socket.emit('login', {isSuccess: false, nickname, code: 'ERROR_ROOM_NO_EXISTS'})
      return
    }
    const room = rooms.find(roomname)
    socket.join(room.name())
    users.push(nickname)
    socket.data.room = room
    socket.data.roomname = roomname
    socket.data.nickname = nickname
    const takeover = room.getTakeover(nickname)
    socket.emit('login', {isSuccess: true, nickname, takeover})
    io.to('admin.' + socket.data.room.name()).emit('notice.login', {isSuccess: true, nickname})
    console.log('login', {isSuccess: true, nickname})
  })
  socket.on('logout', () => {
    if (socket.data.nickname.length > 0) {
      console.log('logout', socket.data.nickname)
      users = users.filter(u => u !== socket.data.nickname)
      if (socket.data.room.name()) {//send admin someone disconnect from app
        io.to('admin.' + socket.data.room.name())
          .emit('notice.disconnect', socket.data.nickname)
      }
    }
    if (socket.data.isAdmin) {
      socket.emit('auth.logout')
    }
  })

  //anonymous
  socket.on('score', payload => {
    payload = payload || {room: ''}
    if (payload.room) {
      socket.join('score.' + payload.room)
      const room = rooms.find(payload.room)
      if (room) {
        socket.emit('score', {score: room.getScore()})
      }
    }
  })

  socket.on('disconnect', () => {
    if (socket.data.nickname.length > 0) {
      users = users.filter(u => u !== socket.data.nickname)
      if (socket.data.room.name()) {//send admin someone disconnect from app
        io.to('admin.' + socket.data.room.name()).emit('notice.disconnect', socket.data.nickname)
      }
      console.log('disconnect', socket.data.nickname)
    }
  })
  socket.on('rooms', () => {
    socket.emit('rooms', rooms.getAllRoomsNames())
  })
})

http.listen(PORT, function () {
  console.log('listening on *:' + PORT)
})
