import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    nickname: '',
    isConnected: false,
    isLogged: false,
    answer: '',
    answerAlt: '',
  },
  mutations: {
    ['changeNickname'] (state, {nickname}) {
      state.nickname = nickname
    },
    ['successfulLogin'] (state) {
      state.isLogged = true
    },
    ['setAnswer'] (state, {answer, answerAlt}) {
      state.answer = answer
      state.answerAlt = answerAlt
    }
  },
  actions: {
    ['answer'] ({state, commit}, {answer, answerAlt}) {
      if (state.isLogged) {
        const {$socket} = this._vm
        $socket.emit('answer', {answer, answerAlt})
        commit('setAnswer', {answer, answerAlt})
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
    ['socket.answer'] ({commit}, {isSuccess}) {
      if (!isSuccess) {
        alert('Wysłałeś już swoją odpowiedź.')
      } else {
        commit('setAnswer', {answer: '', answerAlt: ''})
      }
    },
    ['socket.reset'] ({commit}, {isSuccess}) {
      if (isSuccess) {
        commit('setAnswer', {answer: '', answerAlt: ''})
      }
    },
  },
  modules: {}
})
