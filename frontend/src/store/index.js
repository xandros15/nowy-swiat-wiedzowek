import Vue from 'vue'
import Vuex from 'vuex'

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
  },
  actions: {
    ['answer'] ({state, commit}, {answer, answerAlt}) {
      if (state.isLogged) {
        const {$socket} = this._vm
        $socket.emit('answer', {answer, answerAlt})
        commit('setAnswer', {answer, answerAlt})
      }
    },
    ['login'] ({commit}, {nickname, room}) {
      const {$socket} = this._vm
      $socket.emit('login', {nickname, room})
      commit('changeRoom', room)
    },
    ['score.listen'] ({commit}, {room}) {
      const {$socket} = this._vm
      $socket.emit('score', {room})
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
      const {$socket} = this._vm
      $socket.emit('admin', {password, room})
      commit('setPassword', password)
      commit('changeRoom', room)
    },
    ['admin.reset'] () {
      this._vm.$socket.emit('reset')
    },
    ['admin.reset.single'] (store, nickname) {
      if (confirm(`Are you sure to remove ${nickname}'s answer?`)) {
        this._vm.$socket.emit('reset.single', nickname)
      }
    },
    ['admin.point.add'] (store, nickname) {
      this._vm.$socket.emit('score.add', nickname, 1)
    },
    ['admin.point.remove'] (store, nickname) {
      this._vm.$socket.emit('score.remove', nickname, 1)
    },
    ['admin.point.remove3'] (store, nickname) {
      this._vm.$socket.emit('score.remove', nickname, 3)
    },
    ['admin.tiebreaker.add'] (store, nickname) {
      this._vm.$socket.emit('tiebreaker.add', nickname, 1)
    },
    ['admin.tiebreaker.remove'] (store, nickname) {
      this._vm.$socket.emit('tiebreaker.remove', nickname, 1)
    },
    ['admin.score.reset'] () {
      if (confirm(`Are you sure you want to wipe whole score sheet?`)) {
        this._vm.$socket.emit('score.reset')
      }
    },
    ['admin.notify'] (store, {type, message}) {
      this._vm.$socket.emit('admin.notify', {type, message})
    },
    ['socket.reset.answers'] ({commit}, {isSuccess}) {
      if (isSuccess) {
        commit('resetAnswers')
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
      this._vm.$toastr.Add({type, msg: message})
    },
    ['socket.score'] ({commit,}, {score}) {
      commit('setScore', score)
    }
  },
  modules: {}
})
