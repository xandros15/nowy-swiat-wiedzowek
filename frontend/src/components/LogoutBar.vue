<template>
    <div class="logout-bar" v-if="isLogged">
        <button @click="logout" class="button">Logout</button>
    </div>
</template>

<script>
  import { mapMutations, mapState } from 'vuex'

  export default {
    name: "LogoutBar",
    computed: mapState(['isLogged']),
    methods: mapMutations(['logout']),
  }
</script>

<style lang="scss" scoped>
    .logout-bar {
        position: fixed;
        bottom: 0;
        right: 0;

        .button {
            text-transform: uppercase;
            outline: 0;
            background: #b84d08;
            border: 0;
            padding: 15px;
            color: #fff;
            font-size: 14px;
            cursor: pointer;

            &:hover, &:active, &:focus {
                background: #d15208;

            }
        }
    }
</style>