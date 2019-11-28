import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    nickname: '',
    isAdmin: false,
    isLogged: false,
    answer: '',
    answerAlt: '',
    login: '',
    password: '',
    answers: [],
  },
  mutations: {
    ['changeNickname'] (state, {nickname}) {
      state.nickname = nickname
    },
    ['successfulLogin'] (state, isAdmin) {
      isAdmin = isAdmin || false
      state.isLogged = true
      state.isAdmin = isAdmin
    },
    ['setAnswer'] (state, {answer, answerAlt}) {
      state.answer = answer
      state.answerAlt = answerAlt
    },
    //admin
    ['pushAnswer'] (state, answer) {
      state.answers.push(answer)
    },
    ['resetAnswers'] (state) {
      state.answers = []
    },
    ['setPassword'] (state, password) {
      state.password = password
    },
  },
  actions: {
    ['answer'] ({state, commit}, {answer, answerAlt}) {
      if (state.isLogged) {
        const {$socket} = this._vm
        $socket.emit('answer', {answer, answerAlt})
        commit('setAnswer', {answer, answerAlt})
      }
    },
    ['login'] (store, {nickname, room}) {
      const {$socket} = this._vm
      $socket.emit('login', {nickname, room})
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
    ['socket.reconnect'] ({state, dispatch}) {
      if (state.isLogged && state.nickname && confirm('Rozłączono. Czy chcesz połączyć się ponownie?')) {
        dispatch('login', {nickname: state.nickname,})
      } else {
        document.location.reload()
      }
    },
    //admin
    ['admin.login'] ({commit,}, {password}) {
      const {$socket} = this._vm
      $socket.emit('admin', {password})
      commit('setPassword', password)
    },
    ['admin.reset'] (store, room) {
      this._vm.$socket.emit('reset', room)
    },
    ['socket.reset.answers'] ({commit}, {isSuccess}) {
      if (isSuccess) {
        commit('resetAnswers')
      } else {
        alert('Błąd przy resetowaniu Odpowiedzi.')
      }
    },
    ['socket.admin'] ({commit,}, {isSuccess}) {
      if (isSuccess) {
        commit('successfulLogin', true)
      } else {
        alert('Błąd przy logowaniu.')
      }
    },
    ['socket.answer.receive'] ({commit,}, answer) {
      commit('pushAnswer', answer)
    },
    ['socket.answers.receive'] ({commit,}, {answers}) {
      commit('resetAnswers')
      answers = answers || []
      for (const answer of answers) {
        commit('pushAnswer', answer)
      }
    },
  },
  modules: {}
})
