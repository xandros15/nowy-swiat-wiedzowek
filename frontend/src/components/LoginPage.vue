<template>
    <div class="login-container">
        <form @submit.prevent="login" class="login-form">
            <h2 class="title">Wprowadź nazwę dużyny i wciśnij "dołącz".</h2>
            <input class="login-form-input" placeholder="nazwa drużyny" title="nazwa drużyny" v-model="nickname"/>
            <Btn class="login-form-button">Dołącz</Btn>
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
      return {nickname: ''}
    },
    methods: {
      login () {
        if (this.nickname.length > 0 && this.nickname.length < 16) {
          this.$store.dispatch('login', {nickname: this.nickname, room: this.room}).then(() => this.nickname = '')
        } else {
          this.$toastr.e('Nazwa nie może być krótsza niż 1 znaki i dłuższa niż 16 znaków.')
        }
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
