<template>
    <div class="room-list">
        <h1 :key="room" v-for="room in rooms">
            <router-link :to="{name: 'TeamPage', params: {room}}" class="room-link">
                {{room}}
            </router-link>
        </h1>
    </div>
</template>

<script>
  export default {
    name: "RoomsPage",
    data () {
      return {
        rooms: ['remcon', 'xmascon']
      }
    }
  }
</script>

<style lang="scss" scoped>
    .room-link {
        font-size: 120%;
        color: #f2f2f2;
        text-shadow: 2px 2px 2px #000;
        text-decoration: none;

        &:hover {
            text-shadow: 1px 1px 1px #000;
        }
    }
</style>
