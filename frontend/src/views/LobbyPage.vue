<template>
  <div>
    <div class="title">{{ $t('ROOM_LIST') }}</div>
    <div class="room-list" v-if="rooms.length > 0">
      <router-link :key="room" v-for="room in rooms" :to="{name: 'TeamPage', params: {room}}" class="room">
        {{ room }}
      </router-link>
    </div>
    <div class="no-room" v-else>
      {{ $t('NO_ROOMS') }}
    </div>
  </div>
</template>

<script>
import {mapState} from "vuex";
import socket from "@/services/socket";

export default {
  name: "LobbyPage",
  created () {
    socket.emit('rooms')
  },
  computed: mapState({
    rooms: state => state.rooms
  }),
}
</script>

<style lang="scss" scoped>
.title {
  font-weight: 700;
  font-size: 60px;
  background: rgba(0, 0, 0, 0.83);
  color: #f2f2f2;
  padding: .5rem;
  display: block;
  margin: .3rem 0;
}

.room-list {
  text-align: left;
  font-size: 36px;
  font-weight: 700;
  color: #eeeeee;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: .3em;
  margin: .3em;
}

.no-room {
  font-weight: 700;
  font-size: 36px;
  padding: .3rem;
  background: rgba(0, 0, 0, 0.83);
  color: #f2f2f2;
  text-decoration: none;
}

.room {
  padding: .3rem;
  background: rgba(0, 0, 0, 0.83);
  color: #f2f2f2;
  text-decoration: none;

  &:hover, &:focus {
    background: rgba(0, 0, 0, 0.50);
  }
}

</style>
