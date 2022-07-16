<template>
    <div class="login-container">
        <form @submit.prevent="loginAdmin" class="login-form">
            <h2 class="title">Admin panel</h2>
            <input autocomplete
                   class="login-form-input"
                   placeholder="hasło"
                   title="hasło"
                   type="password"
                   v-model="password"
            />
            <Btn class="login-form-button">Zaloguj się</Btn>
        </form>
    </div>
</template>

<script>
  import Btn from './Btn'
  export default {
    name: 'LoginPage',
    components: {Btn},
    props: ['room'],
    data () {
      return {password: ''}
    },
    methods: {
      loginAdmin () {
        this.$store.dispatch('admin.login', {password: this.password, room: this.room})
      }
    }
  }
</script>

<style lang="scss" scoped>
    .login {
        &-container {
            width: 360px;
            padding: 8% 0 0;
            margin: auto;
        }

        &-form {
            position: relative;
            z-index: 1;
            background: #fff;
            max-width: 360px;
            margin: 0 auto 100px;
            padding: 45px;
            text-align: center;
            box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.24);

            &-input {
                outline: 0;
                background: #f2f2f2;
                width: 100%;
                border: 0;
                margin: 0 0 15px;
                padding: 15px;
                box-sizing: border-box;
                font-size: 14px;
            }

            &-button {
                width: 100%;
            }
        }
    }
</style>
