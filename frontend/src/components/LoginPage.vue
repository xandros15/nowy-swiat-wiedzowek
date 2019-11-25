<template>
    <form @submit.prevent="login">
        <label for="nickname">Dołącz do Gry</label>
        <input id="nickname" v-model="nickname"/>
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
        this.$store.dispatch('login', {nickname: this.nickname}).then(() => this.nickname = '')
      }
    }
  }
</script>

<style scoped>
</style>
