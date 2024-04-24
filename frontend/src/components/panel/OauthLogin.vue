<template>
  <div class="login-page-wrapper">
    <div class="login-page-container">
      <form class="login-form" @submit.prevent="authenticate">
        <h2 class="title">{{ $t('LOGIN.TITLE') }}</h2>
        <button :disabled="auth_proceed || !auth_url" class="login-form-button">
          {{ $t('LOGIN.BUTTON_LABEL') }}
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { getLocalRefreshToken, getLocalState, setLocalState } from '@/api/auth'
import { mapState } from 'vuex'

export default {
  name: 'panel-login',
  computed: {
    ...mapState({
      auth_url: 'auth_url',
      auth_proceed: 'auth_proceed',
    })
  },
  created () {
    const url = new URL(location)
    if (url.searchParams.has('code')) {
      const code = url.searchParams.get('code')
      const state = url.searchParams.get('state')
      url.searchParams.delete('code')
      url.searchParams.delete('state')

      history.replaceState(null, null, url)

      if (getLocalState() !== state) {
        alert('Session expired. Try to login once again')
        setLocalState(null)
        return
      }
      this.$store.commit('auth.proceed_toggle')
      this.$socket.emit('authenticate.code', code)
    }
    this.$socket.emit('authenticate.fetch_url')
  },
  methods: {
    authenticate () {
      this.$store.commit('auth.proceed_toggle')
      const refresh_token = getLocalRefreshToken()
      if (refresh_token) {
        this.$socket.emit('authenticate.refresh_token', refresh_token)
        return
      } else if (this.auth_url) {
        window.location.href = this.auth_url
        return
      }
      alert('Application authentication is disabled. Pleas try again later.')
    },
  },
}
</script>

<style scoped>
.login-page-wrapper {
  width: 100%;
  height: 100%;
  background: #76b852; /* fallback for old browsers */
  background: -webkit-linear-gradient(right, #76b852, #8dc26f);
  background: -moz-linear-gradient(right, #76b852, #8dc26f);
  background: -o-linear-gradient(right, #76b852, #8dc26f);
  background: linear-gradient(to left, #76b852, #8dc26f);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.login-page-container {
  width: 360px;
  padding: 8% 0 0;
  margin: auto;
}
.login-form {
  position: relative;
  z-index: 1;
  background: #fff;
  max-width: 360px;
  margin: 0 auto 100px;
  padding: 45px;
  text-align: center;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.24);
}
.login-form-button {
  text-transform: uppercase;
  outline: 0;
  background: #4caf50;
  width: 100%;
  border: 0;
  padding: 15px;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
}
.login-form-button:hover, .login-form-button:active, .login-form-button:focus {
  background: #43a047;
}
.login-form-button:disabled,
.login-form-button:disabled:hover,
.login-form-button:disabled:active,
.login-form-button:disabled:focus {
  cursor: not-allowed;
  background: rgba(61, 169, 61, 0.5);
}
</style>
