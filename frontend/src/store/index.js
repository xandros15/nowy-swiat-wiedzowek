import escape from 'escape-html'
import Vue from 'vue'
import Vuex from 'vuex'
import socket from '../services/socket'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    nickname: '',
    isAdmin: false,
    isLogged: false,
    isConnecting: false,
    isConnected: false,
    answer: '',
    answerAlt: '',
    login: '',
    password: '',
    answers: [],
    score: [],
    room: '',
    selected: [],
  },
  getters: {
    ['status'] (state) {
      if (state.isConnected) {
        return 'Connected'
      } else if (state.isConnecting) {
        return 'Connecting'
      } else {
        return 'Disconnect'
      }
    },
  },
  mutations: {
    ['connect'] (state) {
      state.isConnecting = false
      state.isConnected = true
    },
    ['disconnect'] (state) {
      state.isConnected = false
    },
    ['connecting'] (state) {
      state.isConnecting = true
    },
    ['changeNickname'] (state, {nickname}) {
      state.nickname = nickname
    },
    ['changeRoom'] (state, room) {
      state.room = room
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
    ['resetAnswer'] (state, nickname) {
      state.answers = state.answers.filter(answer => answer.nickname !== nickname)
    },
    ['setPassword'] (state, password) {
      state.password = password
    },
    ['logout'] (state) {
      state.password = ''
      state.nickname = ''
      state.isLogged = false
    },
    ['setScore'] (state, score) {
      state.score = score
    },
    ['selectAnswer'] (state, nickname) {
      state.selected.push(nickname)
    },
    ['unselectAnswer'] (state, nickname) {
      state.selected = state.selected.filter(t => t !== nickname)
    },
    ['resetSelectAnswer'] (state) {
      state.selected = []
    },
  },
  actions: {
    ['answer'] ({state, commit}, {answer, answerAlt}) {
      if (state.isLogged) {
        socket.emit('answer', {answer, answerAlt})
        commit('setAnswer', {answer, answerAlt})
      }
    },
    ['login'] ({commit}, {nickname, room}) {
      socket.emit('login', {nickname, room})
      commit('changeRoom', room)
    },
    ['score.listen'] ({commit}, {room}) {
      socket.emit('score', {room})
      commit('changeRoom', room)
    },
    ['socket.login'] ({commit}, {isSuccess, nickname}) {
      if (isSuccess) {
        commit('successfulLogin')
        commit('changeNickname', {nickname})
      } else {
        this._vm.$toastr.e('Błąd w dołączeniu do gry, może zły nickname?')
      }
    },
    ['socket.answer'] ({commit}, {isSuccess}) {
      if (!isSuccess) {
        this._vm.$toastr.e('Wysłałeś już swoją odpowiedź.')
      } else {
        this._vm.$toastr.s('Odpowiedź została wysłana.')
        commit('setAnswer', {answer: '', answerAlt: ''})
      }
    },
    ['socket.reset'] ({commit}, {isSuccess}) {
      if (isSuccess) {
        commit('setAnswer', {answer: '', answerAlt: ''})
      }
    },
    ['socket.reconnect'] ({state, dispatch}) {
      if (state.isLogged) {
        if (state.nickname) {
          dispatch('login', {nickname: state.nickname, room: state.room})
        } else if (state.isAdmin) {
          dispatch('admin.login', {password: state.password, room: state.room})
        }
      }
    },
    ['socket.disconnect'] ({commit}) {
      commit('disconnect')
    },
    ['socket.connect'] ({commit}) {
      commit('connect')
    },
    //admin
    ['admin.login'] ({commit,}, {password, room}) {
      socket.emit('admin', {password, room})
      commit('setPassword', password)
      commit('changeRoom', room)
    },
    ['admin.reset'] () {
      socket.emit('reset')
    },
    ['admin.reset.single'] (store, nickname) {
      if (confirm(`Are you sure to remove ${nickname}'s answer?`)) {
        socket.emit('reset.single', nickname)
      }
    },
    ['admin.bulkpoints'] ({state, commit}, {points, tiebreaker}) {
      for (const selected of state.selected) {
        if (points !== 0) {
          socket.emit(
            points > 0 ? 'score.add' : 'score.remove',
            selected,
            Math.abs(points)
          )
        }
        if (tiebreaker !== 0) {
          socket.emit(
            tiebreaker > 0 ? 'tiebreaker.add' : 'tiebreaker.remove',
            selected,
            Math.abs(tiebreaker)
          )
        }
      }
      commit('resetSelectAnswer')
    },
    ['admin.point.add'] (store, nickname) {
      socket.emit('score.add', nickname, 1)
    },
    ['admin.point.remove'] (store, nickname) {
      socket.emit('score.remove', nickname, 1)
    },
    ['admin.tiebreaker.add'] (store, nickname) {
      socket.emit('tiebreaker.add', nickname, 1)
    },
    ['admin.tiebreaker.remove'] (store, nickname) {
      socket.emit('tiebreaker.remove', nickname, 1)
    },
    ['admin.score.reset'] () {
      if (confirm(`Are you sure you want to wipe whole score sheet?`)) {
        socket.emit('score.reset')
      }
    },
    ['admin.notify'] (store, {type, message}) {
      socket.emit('admin.notify', {type, message})
    },
    ['socket.reset.answers'] ({commit}, {isSuccess}) {
      if (isSuccess) {
        commit('resetAnswers')
        commit('resetSelectAnswer')
      } else {
        this._vm.$toastr.e('Błąd przy resetowaniu Odpowiedzi.')
      }
    },
    ['socket.reset.single'] ({commit}, {isSuccess, nickname}) {
      if (isSuccess) {
        commit('resetAnswer', nickname)
      } else {
        this._vm.$toastr.e('Błąd przy resetowaniu Odpowiedzi.')
      }
    },
    ['socket.admin'] ({commit,}, {isSuccess}) {
      if (isSuccess) {
        commit('successfulLogin', true)
      } else {
        this._vm.$toastr.e('Błąd przy logowaniu.')
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
    ['socket.notification'] (store, {message, type}) {
      const types = {
        'error': 'error',
        'warning': 'warning',
        'success': 'success',
      }

      type = types[type] || 'info'
      const msg = escape(message)
      this._vm.$toastr.Add({type, msg})
    },
    ['socket.score'] ({commit,}, {score}) {
      commit('setScore', score)
    },
    ['socket.notice.login'] (store, response) {
      if (response.isSuccess) {
        const msg = escape(`${response.nickname} successful join to game.`)
        this._vm.$toastr.Add({type: 'success', msg})
      } else {
        const msg = escape(`${response.nickname} failed join to game.`)
        this._vm.$toastr.Add({type: 'warning', msg})
      }
    },
    ['socket.notice.disconnect'] (store, user) {
      const msg = escape(`${user.nickname} disconnected from game.`)
      this._vm.$toastr.Add({type: 'error', msg})
    },
  },
  modules: {}
})
