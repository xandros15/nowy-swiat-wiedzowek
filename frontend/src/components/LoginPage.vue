<template>
  <div class="login-container">
    <form @submit.prevent="login" class="login-form">
      <h2 class="title">Wprowadź swoją nazwę drużyny i wciśnij "dołącz".</h2>
      <input class="login-form-input" placeholder="nazwa drużyny" title="nazwa drużyny" v-model.trim="nickname"/>
      <button class="login-form-button button">Dołącz</button>
      <div class="nicknames" v-if="nicknames.length > 0">
        <small class="nicknames-description">Ostatnio używane:</small>
        <button :key="lastNickname" @click.prevent="selectNickname(lastNickname)"
             class="nicknames-button button"
             v-for="lastNickname in nicknames">
          {{ lastNickname }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>

  import { addNickname, forgotNickname, getNicknames } from '@/services/nickname-storage'
  import t from "@/services/translator";

  export default {
    name: 'LoginPage',
    props: ['room'],
    data () {
      return {
        nickname: '',
        nicknames: [],
      }
    },
    created () {
      this.nicknames = getNicknames()
    },
    methods: {
      selectNickname (nickname) {
        if (nickname.length > 0 && nickname.length < 16) {
          this.nickname = nickname
        }
      },
      forgotNickname (nickname) {
        forgotNickname(nickname)
        this.nicknames = getNicknames()
      },
      login () {
        if (this.nickname.length > 0 && this.nickname.length < 16) {
          this.$store.dispatch('login', {nickname: this.nickname, room: this.room}).then(() => this.nickname = '')
          addNickname(this.nickname)
          this.nicknames = getNicknames()
        } else {
          this.$toastr.e(t('INVALID_TEAM_NAME'))
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
    .nicknames {

        &-description {
            display: block;
            text-align: left;
            margin: .5rem 0;
        }

        &-button {
            text-transform: none;
            margin-bottom: .3rem;
            width: 100%;
            display: block;
        }
    }

    .login {
        &-container {
            width: 360px;
            padding: 2rem 0 0;
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
            box-shadow: 0 0 20px 0 rgba(0,0,0,.2), 0 5px 5px 0 rgba(0,0,0,.24);

            &-input {
                outline: 0;
                background: #f2f2f2;
                width: 100%;
                border: 0 solid #000;
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
