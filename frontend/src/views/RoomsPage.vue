<template>
    <div class="room-list">
        <div v-if="rooms.length > 0">
            <h1 :key="room" v-for="room in rooms">
                <router-link :to="{name: 'TeamPage', params: {room}}" class="room-link">
                    {{room}}
                </router-link>
            </h1>
        </div>
        <h1 class="h1" v-else>
            Przepraszam, nie ma aktualnie otwartych pokoi.
        </h1>
    </div>
</template>

<script>
  export default {
    name: "RoomsPage",
    created () {
      fetch('/resources/rooms.json')
        .then(r => r.json())
        .then(rooms => this.rooms = rooms)
        .catch(() => this.rooms = [])
    },
    data () {
      return {
        rooms: []
      }
    }
  }
</script>

<style lang="scss" scoped>
    .h1 {
        font-size: 2rem;
        color: #f2f2f2;
        text-shadow: 2px 2px 2px #000;
        text-decoration: none;
    }

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
