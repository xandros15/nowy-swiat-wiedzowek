<template>
  <div class="login-page-wrapper">
    <div class="login-page-container">
      <form @submit.prevent="loginAdmin" class="login-form">
        <h2 class="title">Admin panel</h2>
        <input class="login-form-input" placeholder="hasło" title="hasło" type="password" v-model="password"/>
        <button class="login-form-button">Zaloguj się</button>
      </form>
    </div>
  </div>
</template>

<script>

export default {
  name: 'LegacyLoginAdminPage',
  components: {},
  props: ['room'],
  data() {
    return {password: ''}
  },
  methods: {
    loginAdmin() {
      // console.log(this.room)
      this.$store.dispatch('legacy.admin.login', {password: this.password, room: this.room})
    }
  }
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
.login-form-input {
  outline: 0;
  background: #f2f2f2;
  width: 100%;
  border: 0;
  margin: 0 0 15px;
  padding: 15px;
  box-sizing: border-box;
  font-size: 14px;
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
