import { getLocalRefreshToken, setLocalAccessToken, setLocalRefreshToken, setLocalState } from '@/api/auth'
import router from '@/router'
import escape from 'escape-html'
import Vue from 'vue'
import Vuex from 'vuex'
import socket from '../services/socket'
import t from '../services/translator'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    legacy: false,
    auth_url: false,
    auth_proceed: false,
    adminRooms: [],
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
    lastAnswers: [],
    score: [],
    room: '',
    selected: [],
    takeovers: [],
    takeover: false,
  },
  getters: {
    ['hasRoom'] (state) {
      return state.adminRooms.length > 0
    },
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
    //auth
    ['auth.proceed_off'] (state) {
      state.auth_proceed = false
    },
    ['auth.proceed_toggle'] (state) {
      state.auth_proceed = !state.auth_proceed
    },
    ['auth.url'] (state, {auth_url, auth_state}) {
      setLocalState(auth_state)
      state.auth_url = auth_url
    },
    ['auth.refresh'] (state, {refresh_token, access_token}) {
      if (refresh_token) {
        setLocalRefreshToken(refresh_token)
        setLocalAccessToken(access_token)
      } else {
        setLocalRefreshToken(null)
        setLocalAccessToken(null)
      }
    },
    ['auth.logout'] () {
      setLocalRefreshToken(null)
      setLocalAccessToken(null)
    },
    //connection status
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
    //join to game
    ['changeNickname'] (state, {nickname}) {
      state.nickname = nickname
    },
    ['changeRoom'] (state, room) {
      state.room = room
    },
    ['successfulLogin'] (state, isAdmin, isLegacy) {
      isAdmin = isAdmin || false
      isLegacy = isLegacy || false
      state.isLogged = true
      state.isAdmin = isAdmin
      state.legacy = isLegacy
    },
    //answer
    ['setAnswer'] (state, {answer, answerAlt}) {
      state.answer = answer
      state.answerAlt = answerAlt
    },
    //admin
    ['pushAnswer'] (state, answer) {
      state.answers.push(answer)
    },
    ['resetAnswers'] (state) {
      state.lastAnswers = state.answers
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
    //list of total score
    ['setScore'] (state, score) {
      state.score = score
    },
    //bulk
    ['selectAnswer'] (state, nickname) {
      state.selected.push(nickname)
    },
    ['unselectAnswer'] (state, nickname) {
      state.selected = state.selected.filter(t => t !== nickname)
    },
    ['resetSelectAnswer'] (state) {
      state.selected = []
    },
    ['takeover'] (state, takeover) {
      state.takeover = takeover
    },
    ['resetTakeover'] (state) {
      state.takeover = false
    },
    ['setTakeovers'] (state, takeovers) {
      state.takeovers = takeovers
    },
  },
  actions: {
    //auth
    ['legacy.admin.login'] ({commit,}, {password, room}) {
      socket.emit('legacy.admin', {password, room})
      commit('setPassword', password)
      commit('changeRoom', room)
    },
    ['auth.logout'] ({commit}) {
      commit('auth.logout')
      location.reload()
    },
    ['socket.authenticate.url'] ({commit}, auth_url) {
      const auth_state = (new URL(auth_url)).searchParams.get('state')
      if (auth_state) {
        commit('auth.url', {auth_url, auth_state})
      }
    },
    ['socket.authenticate.code'] ({commit}, tokens) {//save tokens in browser
      commit('auth.proceed_off')
      if (tokens) {
        commit('auth.refresh', tokens)
        commit('successfulLogin', true)
        router.replace({name: 'AdminPanel'})
        return
      }
      alert('Session expired, try to login once again.')
      commit('auth.refresh', {refresh_token: false})
    },
    ['socket.authenticate.refresh_token'] ({commit}, tokens) {//save tokens in browser
      commit('auth.proceed_off')
      if (tokens) {
        commit('auth.refresh', tokens)
        commit('successfulLogin', true)
        router.replace({name: 'AdminPanel'})
        return
      }
      alert('Session expired, try to login once again.')
      commit('auth.refresh', {refresh_token: false})
      router.replace({name: 'OauthLogin'})
    },
    ['socket.admin.room.create'] (state, payload) {
      if (payload.isSuccess === false) {
        this._vm.$toastr.e(t('CREATE_ROOM_ERROR'))
        return
      }
      this._vm.$toastr.s(t('CREATE_ROOM_SUCCESS'))
      //admin.room.join
    },
    ['socket.admin.rooms'] ({state}, payload) {
      state.adminRooms = payload
    },
    ['socket.admin.room.join'] (store, {code}) {
      if (code === 'ROOM_NO_EXISTS') {
        this._vm.$toastr.e(t(code))
        router.replace({name: 'AdminPanel'})
      }
    },
    ///
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
    ['logout'] ({state, commit}) {
      socket.emit('logout')
      commit('logout')
      if (state.isAdmin) {
        commit('auth.logout')
        router.replace({name: 'OauthLogin'})
      }
    },
    ['score.listen'] ({commit}, {room}) {
      socket.emit('score', {room})
      commit('changeRoom', room)
    },
    ['socket.login'] ({commit}, {isSuccess, nickname, takeover, code}) {
      if (isSuccess) {
        commit('successfulLogin')
        commit('takeover', takeover)
        commit('changeNickname', {nickname})
      } else if (code === 'ROOM_NO_EXISTS') {
        this._vm.$toastr.e(t(code))
        router.replace({name: 'LobbyPage'})
      } else if (code === 'ERROR_USER_EXISTS') {
        this._vm.$toastr.e(t(code))
      } else if (code === 'INVALID_NICKNAME') {
        this._vm.$toastr.e(t(code))
      }
    },
    ['socket.answer'] ({commit}, {isSuccess}) {
      if (!isSuccess) {
        this._vm.$toastr.e(t('ANSWER_ALREADY_SENT'))
      } else {
        this._vm.$toastr.s(t('ANSWER_SENT'))
        commit('setAnswer', {answer: '', answerAlt: ''})
      }
    },
    ['socket.reconnect'] ({state, dispatch}) {
      this._vm.$toastr.s(t('RECONNECTED'))
      if (state.isLogged) {
        if (state.nickname) {
          dispatch('login', {nickname: state.nickname, room: state.room})
        } else if (state.isAdmin && state.legacy) {
          dispatch('legacy.admin.login', {password: state.password, room: state.room})
        } else if (state.isAdmin) {
          const refreshToken = getLocalRefreshToken()
          if (!refreshToken) {
            router.replace({name: 'OauthLogin'})
            return
          }
          socket.emit('authenticate.refresh_token', refreshToken)
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
    ['admin.team.register'](store, nickname) {
      socket.emit('score.add', nickname, 0)
    },
    ['admin.point.add'] (store, nickname) {
      socket.emit('score.add', nickname, 1)
    },
    ['admin.point.add.3'] (store, nickname) {
      socket.emit('score.add', nickname, 3)
    },
    ['admin.point.remove'] (store, nickname) {
      socket.emit('score.remove', nickname, 1)
    },
    ['admin.point.zero'] ({state}, nickname) {
      const team = state.score.find(team => team.nickname === nickname)
      if (team) {
        socket.emit('score.remove', nickname, team.points)
      }
    },
    ['admin.tiebreaker.add'] (store, nickname) {
      socket.emit('tiebreaker.add', nickname, 1)
    },
    ['admin.tiebreaker.remove'] (store, nickname) {
      socket.emit('tiebreaker.remove', nickname, 1)
    },
    ['admin.nickname.remove'] (store, nickname) {
      socket.emit('score.nickname.remove', nickname)
    },
    ['admin.score.reset'] () {
      if (confirm(t('CONFIRM_RESET_SCORE'))) {
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
        this._vm.$toastr.e(t('RESET_ANSWER_ERROR'))
      }
    },
    ['socket.reset.single'] ({commit}, {isSuccess, nickname}) {
      if (isSuccess) {
        commit('resetAnswer', nickname)
      } else {
        this._vm.$toastr.e(t('RESET_ANSWER_ERROR'))
      }
    },
    ['socket.admin'] ({commit,}, {isSuccess, code, legacy}) {
      if (isSuccess) {
        commit('successfulLogin', true, !!legacy)
      } else if (code) {
        this._vm.$toastr.e(t(code))
      } else {
        this._vm.$toastr.e(t('LOGIN_ERROR'))
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
      let msg = escape(message)
      msg = t(msg)
      this._vm.$toastr.Add({type, msg})
    },
    ['socket.score'] ({commit,}, {score}) {
      commit('setScore', score)
    },
    ['socket.notice.login'] (store, response) {
      if (response.isSuccess) {
        const msg = escape(`${response.nickname} join to game.`)
        this._vm.$toastr.Add({type: 'success', msg})
      } else {
        const msg = escape(`${response.nickname} cannot join to game.`)
        this._vm.$toastr.Add({type: 'warning', msg})
      }
    },
    ['socket.notice.disconnect'] (store, nickname) {
      const msg = escape(`${nickname} disconnected from game.`)
      this._vm.$toastr.Add({type: 'error', msg})
    },
    ['socket.error'] (store, {code}) {
      this._vm.$toastr.e(t(code))
    },
    ['takeover'] ({state}) {
      if (state.isLogged && !state.takeover) {
        socket.emit('takeover')
      }
    },
    ['socket.takeover'] ({commit}, {isSuccess, takeover}) {
      if (isSuccess === true) {
        commit('takeover', takeover)
      }
    },
    ['socket.takeover.reset'] ({commit}) {
      commit('resetTakeover')
    },
    ['socket.takeover.list'] ({commit}, {takeovers}) {
      commit('setTakeovers', takeovers)
    },
    ['takeover.reset'] ({commit}) {
      socket.emit('takeover.reset')
      commit('setTakeovers', [])
    },
    ['t'](store, text) {
      return t(text)
    }
  },
  modules: {}
})
