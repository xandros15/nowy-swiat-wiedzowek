import { io } from 'socket.io-client'

const socket = io(process.env.NODE_ENV === 'development' ? 'http://localhost:3333' : '')

export default socket
