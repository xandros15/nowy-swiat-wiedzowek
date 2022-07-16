import VueSocketIO from 'vue-socket.io'
import store from '../store'
import socket from './socket'

const PREFIX = 'socket.'

const vueSocketIO = new VueSocketIO({
  debug: process.env.NODE_ENV === 'development',
  connection: socket,
  vuex: {
    store,
    actionPrefix: PREFIX,
    mutationPrefix: PREFIX,
  },
})

//workaround of reconnect event
socket.io.on('reconnect', (...args) => store.dispatch(PREFIX + 'reconnect', args))

export default vueSocketIO
