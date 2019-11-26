import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    nickname: '',
    isConnected: false,
    isLogged: false,
  },
  mutations: {
    ['changeNickname'] (state, {nickname}) {
      state.nickname = nickname
    },
    ['successfulLogin'] (state) {
      state.isLogged = true
    },
  },
  actions: {
    ['answer'] ({state}, {answer, answerAlt}) {
      if (state.isLogged) {
        const {$socket} = this._vm
        $socket.emit('answer', {answer, answerAlt})
      }
    },
    ['login'] ({state}, {nickname}) {
      if (!state.isLogged) {
        const {$socket} = this._vm
        $socket.emit('login', {nickname})
      }
    },
    ['socket.login'] ({commit}, {isSuccess, nickname}) {
      if (isSuccess) {
        commit('successfulLogin')
        commit('changeNickname', {nickname})
      } else {
        alert('Błąd w dołączeniu do gry, może zły nickname?')
      }
    },
    ['socket.answer'] (store, {isSuccess}) {
      if (!isSuccess) {
        alert('Wysłałeś już swoją odpowiedź.')
      }
    },
  },
  modules: {}
})
