<template>
    <form @submit.prevent="login">
        <label for="nickname">Dołącz do Gry</label>
        <input id="nickname" v-model="nickname"/>
        <button>Dołącz</button>
    </form>
</template>

<script>
  import { mapActions } from 'vuex'

  export default {
    name: 'LoginPage',
    data () {
      return {nickname: ''}
    },
    methods: {
      ...mapActions({
        login: ''
      })
    }
  }
</script>

<style scoped>
</style>
