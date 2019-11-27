<template>
    <div id="app">
        <LoginPage v-if="!isLogged"/>
        <AnswerPage v-else/>
    </div>
</template>

<script>
  import { mapState } from 'vuex'
  import AnswerPage from './components/AnswerPage'
  import LoginPage from './components/LoginPage'

  export default {
    name: 'app',
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
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
    }

    #app, html, body {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
    }
</style>
