import { io } from 'socket.io-client'

const socket = io(process.env.NODE_ENV === 'development' ? 'http://192.168.0.61:3333' : '')

export default socket
