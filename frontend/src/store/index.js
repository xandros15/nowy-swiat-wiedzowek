import {getLocalRefreshToken, setLocalAccessToken, setLocalRefreshToken, setLocalState} from '@/api/auth'
import router from '@/router'
import {createStore} from 'vuex'
import socket from '@/services/socket'
import {error} from "@/services/toastr"
import t from "@/services/translator"

export default createStore({
  state: {
    legacy: false,
    auth_url: false,
    auth_proceed: false,
    adminRooms: [],
    nickname: '',
    isAdmin: false,
    isLogged: false,
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
    rooms: [],
    history: [],
  },
  getters: {
    ['hasRoom'] (state) {
      return state.adminRooms.length > 0
    },
    ['status'] (state) {
      if (state.isConnected) {
        return 'Connected'
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
      state.isConnected = true
    },
    ['disconnect'] (state) {
      state.isConnected = false
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
    ['setAdminRooms'](state, rooms) {
      state.adminRooms = rooms
    },
    ['setRooms'](state, rooms){
      state.rooms = rooms
    },
    //history
    ['setHistory'](state, history) {
      state.history = history
    }
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
    async ['admin.login'] ({state, dispatch}) {
       if (!state.isAdmin) {
         return;
       }

       if (state.legacy) {
         dispatch('legacy.admin.login', {password: state.password, room: state.room})
         return;
       }

      const refreshToken = getLocalRefreshToken()
      if (!refreshToken) {
        await router.replace({name: 'OauthLogin'});
        return;
      }

      socket.emit('authenticate.refresh_token', refreshToken);
    },
    ///
    ['answer'] ({state, commit}, {answer, answerAlt}) {
      if (!state.isConnected) {
        error('NOT_CONNECTED', true)
        return
      }

      if (state.isLogged) {
        socket.emit('answer', {answer, answerAlt})
        commit('setAnswer', {answer, answerAlt})
      }
    },
    ['login'] ({commit, state}, {nickname, room}) {
      socket.emit('login', {nickname, room})
      commit('changeRoom', room)
    },
    async ['logout'] ({state, commit}) {
      socket.emit('logout')
      commit('logout')
      if (state.isAdmin) {
        commit('auth.logout')
        await router.replace({name: 'OauthLogin'})
      }
    },
    ['score.listen'] ({commit}, {room}) {
      socket.emit('score', {room})
      commit('changeRoom', room)
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
    ['takeover'] ({state}) {
      if (!state.isConnected) {
        error('NOT_CONNECTED', true)
        return
      }

      if (state.isLogged && !state.takeover) {
        socket.emit('takeover')
      }
    },
    ['takeover.reset'] ({commit}) {
      socket.emit('takeover.reset')
      commit('setTakeovers', [])
    },
  },
  modules: {}
})
