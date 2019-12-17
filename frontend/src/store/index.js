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
      this._vm.$socket.emit('reset.single', nickname)
    },
    ['admin.point.add'] (store, nickname) {
      this._vm.$socket.emit('score.add', nickname, 1)
    },
    ['admin.point.remove'] (store, nickname) {
      this._vm.$socket.emit('score.remove', nickname, 1)
    },
    ['admin.score.reset'] () {
      this._vm.$socket.emit('score.reset')
    },
    ['socket.reset.answers'] ({commit}, {isSuccess}) {
      if (isSuccess) {
        commit('resetAnswers')
      } else {
        alert('Błąd przy resetowaniu Odpowiedzi.')
      }
    },
    ['socket.reset.single'] ({commit}, {isSuccess, nickname}) {
      if (isSuccess) {
        commit('resetAnswer', nickname)
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
    ['socket.score'] ({commit,}, {score}) {
      commit('setScore', score)
    }
  },
  modules: {}
})
