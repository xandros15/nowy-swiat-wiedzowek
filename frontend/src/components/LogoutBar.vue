<template>
    <div class="logout-bar" v-if="isLogged">
        <button @click="logout" class="button">{{$t('LOGOUT.BUTTON_LABEL')}}</button>
    </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex'

  export default {
    name: "LogoutBar",
    computed: mapState(['isLogged']),
    methods: mapActions(['logout']),
  }
</script>

<style lang="scss" scoped>
    .logout-bar {
        z-index: 999;
        position: fixed;
        bottom: 0;
        right: 0;
    }
</style>