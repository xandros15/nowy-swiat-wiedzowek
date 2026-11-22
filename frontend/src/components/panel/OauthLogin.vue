<template>
  <div class="login-page-wrapper">
    <div class="login-page-container">
      <form class="login-form" @submit.prevent="authenticate">
        <h2 class="title">{{ $t('LOGIN.TITLE') }}</h2>
        <div style="margin-bottom: .3rem">
          <button :disabled="auth_proceed || !auth_url" class="login-form-button">
            {{ $t('LOGIN.BUTTON_LABEL') }}
          </button>
        </div>
        <div>
          <button @click.prevent="showQr" :disabled="auth_proceed || !auth_url" class="login-form-button">
            {{ $t('LOGIN.QR_BUTTON_LABEL') }}
          </button>
          <div v-if="auth_device_url" style="overflow: hidden; position: relative">
            <a href="#" @click.prevent="clickOnQrCode" target="_blank">
            <span class="qr-info" v-if="['access_denied', 'expired_token'].includes(auth_device_status)">
              {{ $t('LOGIN.QR_REFRESH') }}
            </span>
              <span class="qr-info" v-else-if="auth_device_status && auth_device_status !== 'pending'">
              {{ $t('LOGIN.QR_ERROR') }}
            </span>
              <QRcode :key="auth_device_url" :url="auth_device_url" :version="8" :class="{'qr-expiried': auth_device_status !== 'pending'}"/>
            </a>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import {getLocalRefreshToken, getLocalState, setLocalAccessToken, setLocalRefreshToken, setLocalState} from '@/api/auth'
import {mapState} from 'vuex'
import socket from '@/services/socket'
import QRcode from "@/components/QRcode.vue";

export default {
  name: 'panel-login',
  components: {QRcode,},
  computed: {
    ...mapState({
      auth_url: 'auth_url',
      auth_proceed: 'auth_proceed',
      auth_device_url: 'auth_device_url',
      auth_device_status: 'auth_device_status',
    }),
  },
  created() {
    const url = new URL(location)
    this.$store.commit('auth.device_url', null);
    if (url.searchParams.has('code')) {
      const code = url.searchParams.get('code')
      const state = url.searchParams.get('state')
      url.searchParams.delete('code')
      url.searchParams.delete('state')

      history.replaceState(null, null, url)

      if (getLocalState() !== state) {
        alert('Session expired. Try to login once again')
        setLocalState(null)
        setLocalRefreshToken(null)
        setLocalAccessToken(null)
        return
      }
      this.$store.commit('auth.proceed_toggle')
      socket.emit('authenticate.code', code)
    }
    socket.emit('authenticate.fetch_url')
  },
  methods: {
    authenticate() {
      this.$store.commit('auth.proceed_toggle')
      const refresh_token = getLocalRefreshToken()
      if (refresh_token) {
        socket.emit('authenticate.refresh_token', refresh_token)
        return
      } else if (this.auth_url) {
        window.location.href = this.auth_url
        return
      }
      alert('Application authentication is disabled. Pleas try again later.')
    },
    showQr() {
      socket.emit('authenticate.device_url')
    },
    clickOnQrCode() {
      if (this.auth_device_status === 'pending') {
        window.open(this.auth_device_url, '__blank')
        return;
      }

      if (this.auth_device_status === 'approved') {
        return;
      }

      if (['access_denied', 'expired_token'].includes(this.auth_device_status)) {
        this.showQr();
      }
    }
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

.qr-info {
  position: absolute;
  width: 100%;
  top: 40%;
  z-index: 9;
  background-color: #fff;
}

.qr-expiried {
  z-index: 1;
  filter: blur(5px);
}
</style>
