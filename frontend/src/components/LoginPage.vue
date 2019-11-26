<template>
    <form @submit.prevent="login">
        <label for="nickname">Nazwa drużyny</label>
        <input id="nickname" v-model.trim="nickname"/>
        <button>Dołącz</button>
    </form>
</template>

<script>

  export default {
    name: 'LoginPage',
    data () {
      return {nickname: ''}
    },
    methods: {
      login () {
        if (this.nickname.length > 2 && this.nickname.length < 16) {
          this.$store.dispatch('login', {nickname: this.nickname}).then(() => this.nickname = '')
        } else {
          alert('Nazwa nie może być krótsza niż 3 znaki i dłuższa niż 16 znaków.')
        }
      }
    }
  }
</script>

<style scoped>
</style>
