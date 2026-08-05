import {io} from 'socket.io-client'
import router from '@/router'
import escape from 'escape-html'
import store from '@/store'
import {error, info, success, warning} from "@/services/toastr";

const commit = (...args) => store.commit(...args)
const dispatch = (...args) => store.dispatch(...args)
const getState = () => store.state

const socket = io()

socket.on('authenticate.url', (auth_url) => {
    const auth_state = (new URL(auth_url)).searchParams.get('state')
    if (auth_state) {
        commit('auth.url', {auth_url, auth_state})
    }
});
socket.on('authenticate.code', async (tokens) => {//save tokens in browse=> r
    commit('auth.proceed_off')
    if (tokens) {
        commit('auth.refresh', tokens)
        commit('successfulLogin', true)
        await router.replace({name: 'AdminPanel'})
        return
    }
    alert('Session expired, try to login once again.')
    commit('auth.refresh', {refresh_token: false})
});
socket.on('authenticate.refresh_token', async (tokens) => {
    commit('auth.proceed_off')
    if (tokens) {
        const wasReconnect = getState().isAdmin && getState().isLogged
        commit('auth.refresh', tokens)
        commit('successfulLogin', true)
        wasReconnect || await router.replace({name: 'AdminPanel'})

        return
    }
    alert('Session expired, try to login once again.')
    commit('auth.refresh', {refresh_token: false})
    await router.replace({name: 'OauthLogin'})
});
socket.on('admin.room.create', (payload) => {
    if (payload.isSuccess === false) {
        error('CREATE_ROOM_ERROR')
        return
    }
    success('CREATE_ROOM_SUCCESS')
});
socket.on('admin.rooms', (payload) => {
    commit('setAdminRooms', payload)
});
socket.on('admin.room.join', async ({code}) => {
    if (code === 'ROOM_NO_EXISTS') {
        await router.replace({name: 'AdminPanel'})
        error('ROOM_NO_EXISTS')
    }
});
socket.on('login', async ({isSuccess, nickname, takeover, code}) => {
    if (isSuccess) {
        commit('successfulLogin')
        commit('takeover', takeover)
        commit('changeNickname', {nickname})
    } else if (code === 'ROOM_NO_EXISTS') {
        await router.replace({name: 'LobbyPage'})
        error(code, true)
    } else if (code === 'ERROR_USER_EXISTS' && getState().nickname.length > 0 && getState().room.length > 0) {
        warning('RECONNECTION_COLLISION', true)
        dispatch('logout')
    } else if (code === 'ERROR_USER_EXISTS') {
        error(code, true)
    } else if (code === 'INVALID_NICKNAME') {
        error(code, true)
    }
});
socket.on('answer', ({isSuccess}) => {
    if (!isSuccess) {
        error('ANSWER_ALREADY_SENT', true)
    } else {
        success('ANSWER_SENT', true)
        commit('setAnswer', {answer: '', answerAlt: ''})
    }
});
socket.io.on('reconnect', async () => {
    const state = getState()
    success('RECONNECTED', !state.isAdmin)
    if (!state.isLogged) {
        return;
    }

    if (state.nickname) { //is participant
        dispatch('login', {nickname: state.nickname, room: state.room})
    } else if(state.isAdmin) { //is host
        dispatch('admin.login')
    }
});
socket.on('disconnect', () => {
    commit('disconnect')
});
socket.on('connect', () => {
    commit('connect')
});
socket.on('reset.answers', ({isSuccess}) => {
    if (isSuccess) {
        commit('resetAnswers')
        commit('resetSelectAnswer')
    } else {
        error('RESET_ANSWER_ERROR')
    }
});
socket.on('reset.single', ({isSuccess, nickname}) => {
    if (isSuccess) {
        commit('resetAnswer', nickname)
    } else {
        error('RESET_ANSWER_ERROR')
    }
});
socket.on('admin', ({isSuccess, code, legacy}) => {
    if (isSuccess) {
        commit('successfulLogin', true, !!legacy)
    } else if (code) {
        error(code)
    } else {
        error('LOGIN_ERROR')
    }
});
socket.on('answer.receive', (answer) => {
    commit('pushAnswer', answer)
});
socket.on('answers.receive', ({answers}) => {
    commit('resetAnswers')
    answers = answers || []
    for (const answer of answers) {
        commit('pushAnswer', answer)
    }
});
socket.on('notification', ({message, type}) => {
    let msg = escape(message)
    if (type === 'error') {
        error(msg, true)
    } else if (type === 'warning') {
        warning(msg, true)
    } else if (type === 'success') {
        success(msg, true)
    } else {
        info(msg, true)
    }
});
socket.on('score', ({score}) => {
    commit('setScore', score)
});
socket.on('notice.login', (store, response) => {
    if (response?.isSuccess) {
        const msg = escape(`${response.nickname} join to game.`)
        success(msg)
    } else if(response?.nickname) {
        const msg = escape(`${response.nickname} cannot join to game.`)
        warning(msg)
    }
});
socket.on('notice.disconnect', (nickname) => {
    const msg = escape(`${nickname} disconnected from game.`)
    error(msg)
});
socket.on('error', ({code}) => {
    error(code)
});
socket.on('takeover', ({isSuccess, takeover}) => {
    if (isSuccess === true) {
        commit('takeover', takeover)
    }
});
socket.on('takeover.reset', () => {
    commit('resetTakeover')
});
socket.on('takeover.list', ({takeovers}) => {
    commit('setTakeovers', takeovers)
});
socket.on('rooms', (rooms) => {
    commit('setRooms', rooms)
})

export default socket
