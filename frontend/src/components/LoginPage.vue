<template>
    <div class="login-container">
        <form @submit.prevent="login" class="login-form">
            <h2 class="title">Wprowadź nazwę dużyny i wciśnij "dołącz".</h2>
            <input class="login-form-input" placeholder="nazwa drużyny" title="nazwa drużyny" v-model="nickname"/>
            <button class="login-form-button">Dołącz</button>
        </form>
    </div>
</template>

<script>

  export default {
    name: 'LoginPage',
    props: ['room'],
    data () {
      return {nickname: ''}
    },
    methods: {
      login () {
        if (this.nickname.length > 2 && this.nickname.length < 16) {
          this.$store.dispatch('login', {nickname: this.nickname, room: this.room}).then(() => this.nickname = '')
        } else {
          alert('Nazwa nie może być krótsza niż 3 znaki i dłuższa niż 16 znaków.')
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
                text-transform: uppercase;
                outline: 0;
                background: #b84d08;
                width: 100%;
                border: 0;
                padding: 15px;
                color: #fff;
                font-size: 14px;
                cursor: pointer;

                &:hover, &:active, &:focus {
                    background: #d15208;

                }
            }
        }
    }
</style>
