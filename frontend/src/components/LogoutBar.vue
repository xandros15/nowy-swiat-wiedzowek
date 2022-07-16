<template>
    <div class="logout-bar" v-if="isLogged">
        <Btn @click.native="logout" class="button">Logout</Btn>
    </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex'
  import Btn from './Btn'

  export default {
    name: "LogoutBar",
    components: {Btn},
    computed: mapState(['isLogged']),
    methods: mapActions(['logout']),
  }
</script>

<style lang="scss" scoped>
    .logout-bar {
        position: fixed;
        bottom: 0;
        right: 0;
    }
</style>