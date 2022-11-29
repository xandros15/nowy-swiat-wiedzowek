const axios = require('axios')
const TOKEN_URL = 'https://animesongs.org/access/oauth/token'
const AUTH_URL = 'https://animesongs.org/access/oauth/authorize'

function nonce (length) {
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

class Oauth2 {
  constructor ({client_id, client_secret, redirect_uri}) {
    this.client_id = client_id
    this.client_secret = client_secret
    this.redirect_uri = redirect_uri
  }

  getAuthUrl () {
    const state = nonce(12)
    const url = new URL(AUTH_URL)
    url.searchParams.set('response_type', 'code')
    url.searchParams.set('client_id', this.client_id)
    url.searchParams.set('redirect_uri', this.redirect_uri)
    url.searchParams.set('scope', '')
    url.searchParams.set('state', state)
    return url.toString()
  }

  async byCode (code) {
    const data = {
      grant_type: 'authorization_code',
      client_id: this.client_id,
      client_secret: this.client_secret,
      redirect_uri: this.redirect_uri,
      code,
    }
    try {
      const response = await axios.post(TOKEN_URL, data)
      return response.data
    } catch (e) {
      return false
    }
  }

  async byRefresh (refresh_token) {
    const data = {
      grant_type: 'refresh_token',
      client_id: this.client_id,
      client_secret: this.client_secret,
      scope: [],
      refresh_token,
    }
    try {
      const response = await axios.post(TOKEN_URL, data)
      return response.data
    } catch (e) {
      return false
    }
  }
}

module.exports = Oauth2
