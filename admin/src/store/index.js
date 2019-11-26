import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    login: '',
    isConnected: false,
    isLogged: false,
    answers: [],
  },
  mutations: {
    ['successfulLogin'] (state) {
      state.isLogged = true
    },
    ['pushAnswer'] (state, answer) {
      state.answers.push(answer)
    }
  },
  actions: {
    ['login'] ({state}, {password}) {
      if (!state.isLogged) {
        const {$socket} = this._vm
        $socket.emit('admin', {password})
      }
    },
    ['socket.admin'] ({commit,}, {isSuccess}) {
      if (isSuccess) {
        commit('successfulLogin')
      } else {
        alert('Wrong password')
      }
    },
    ['socket.answer'] ({commit,}, answer) {
      commit('pushAnswer', answer)
    },
    ['socket.answers'] ({commit,}, {answers}) {
      answers = answers || []
      for (const answer of answers) {
        commit('pushAnswer', answer)
      }
    }
  },
  modules: {}
})
