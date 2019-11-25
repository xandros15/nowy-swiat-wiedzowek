<template>
    <div id="app">
        <AnswersPage v-if="isLogged"/>
        <LoginPage v-else/>
    </div>
</template>

<script>
  import { mapState } from 'vuex'
  import AnswersPage from './components/AnswersPage'
  import LoginPage from './components/LoginPage'

  export default {
    name: 'app',
    components: {
      AnswersPage,
      LoginPage,
    },
    computed: {
      ...mapState(['isLogged'])
    }
  }
</script>

<style lang="scss">
</style>
