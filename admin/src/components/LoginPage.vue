<template>
    <form @submit.prevent="loginAdmin">
        <input placeholder="password" title="password" type="password" v-model="password">
        <button>Login</button>
    </form>
</template>

<script>
  export default {
    name: 'LoginPage',
    data () {
      return {password: ''}
    },
    methods: {
      loginAdmin () {
        this.$store.dispatch('login', {password: this.password})
      }
    }
  }
</script>

<style scoped>

</style>