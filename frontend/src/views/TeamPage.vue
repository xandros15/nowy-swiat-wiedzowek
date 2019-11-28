<template>
    <div id="app">
        <LoginPage :room="room" v-if="!isLogged"/>
        <AnswerPage v-else/>
    </div>
</template>

<script>
  import { mapState } from 'vuex'
  import AnswerPage from '../components/AnswerPage'
  import LoginPage from '../components/LoginPage'

  export default {
    name: 'TeamPage',
    props: ['room'],
    components: {
      AnswerPage,
      LoginPage,
    },
    computed: {
      ...mapState(['isLogged'])
    }
  }
</script>

<style lang="scss">
</style>
