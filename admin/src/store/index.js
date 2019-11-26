import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    login: '',
    password: '',
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
    },
    ['resetAnswers'] (state) {
      state.answers = []
    },
    ['setPassword'] (state, password) {
      state.password = password
    }
  },
  actions: {
    ['login'] ({commit,}, {password}) {
      const {$socket} = this._vm
      $socket.emit('admin', {password})
      commit('setPassword', password)
    },
    ['reset'] () {
      this._vm.$socket.emit('reset')
    },
    ['socket.reset'] ({commit}, {isSuccess}) {
      if (isSuccess) {
        commit('resetAnswers')
      } else {
        alert('Cannot reset answers.')
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
      commit('resetAnswers')
      answers = answers || []
      for (const answer of answers) {
        commit('pushAnswer', answer)
      }
    },
    ['socket.reconnect'] ({state, dispatch}) {
      if (state.isLogged && state.password && confirm('Disconnect. Do you want to reconnect?')) {
        dispatch('login', {password: state.password,})
      } else {
        document.location.reload()
      }
    }
  },
  modules: {}
})
