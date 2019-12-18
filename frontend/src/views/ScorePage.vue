<template>
    <div id="app">
        <div v-if="isLogged && isAdmin">
            <h2 class="title">Punktacja</h2>
            <div class="flex">
                <Score/>
            </div>
        </div>
        <LoginAdminPage :room="room" v-else/>
    </div>
</template>

<script>
  import { mapState } from 'vuex'
  import Score from '../components/Score'
  import LoginAdminPage from '../components/LoginAdminPage'

  export default {
    name: 'ScorePage',
    components: {Score, LoginAdminPage},
    props: ['room'],
    computed: mapState(['isLogged', 'isAdmin']),
  }
</script>

<style lang="scss" scoped>
    .title {
        color: #f2f2f2;
        text-shadow: 2px 2px 2px #020202;
    }

    .flex {
        display: flex;
        flex-direction: column;
    }
</style>
