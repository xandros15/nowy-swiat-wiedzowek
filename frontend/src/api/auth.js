const AUTH_STATE_KEY = 'quiz-answer.authenticate.state'
const AUTH_REFRESH_KEY = 'quiz-answer.authenticate.refresh'
const AUTH_TOKEN = 'quiz-answer.authenticate.token'

export const getLocalState = () => {
  return sessionStorage.getItem(AUTH_STATE_KEY) || null
}

export const setLocalState = state => {
  if (!state) {
    sessionStorage.removeItem(AUTH_STATE_KEY)
  } else {
    sessionStorage.setItem(AUTH_STATE_KEY, state)
  }
}

export const getLocalRefreshToken = () => {
  return localStorage.getItem(AUTH_REFRESH_KEY) || null
}

export const setLocalRefreshToken = token => {
  if (!token) {
    localStorage.removeItem(AUTH_REFRESH_KEY)
  } else {
    localStorage.setItem(AUTH_REFRESH_KEY, token)
  }
}

export const getLocalAccessToken = () => {
  return localStorage.getItem(AUTH_TOKEN) || null
}

export const setLocalAccessToken = token => {
  if (!token) {
    localStorage.removeItem(AUTH_TOKEN)
  } else {
    localStorage.setItem(AUTH_TOKEN, token)
  }
}
