<template>
    <div id="app">
        <AnswersPage v-if="isLogged && isAdmin"/>
        <LoginAdminPage v-else/>
    </div>
</template>

<script>
  import { mapState } from 'vuex'
  import AnswersPage from '../components/AnswersPage'
  import LoginAdminPage from '../components/LoginAdminPage'

  export default {
    name: 'AdminPage',
    components: {
      AnswersPage,
      LoginAdminPage,
    },
    computed: mapState(['isLogged', 'isAdmin']),
  }
</script>

<style scoped>
</style>
