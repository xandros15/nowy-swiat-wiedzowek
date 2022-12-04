import { io } from 'socket.io-client'

const socket = io(process.env.NODE_ENV === 'development' ? 'http://0.0.0.0:3333' : '')

export default socket
