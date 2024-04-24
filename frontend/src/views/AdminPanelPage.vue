<template>
  <div id="app">
    <div class="admin-panel">
      <h1 v-for="room in adminRooms" :key="room">
        <router-link :to="{name: 'AdminRoom', params: {room}}" class="room-link">
          {{ room }}
        </router-link>
        <span class="clickable" @click.prevent="removeRoom(room)">
          🗑️
        </span>
      </h1>
      <div class="create-room" v-if="!hasRoom">
        <form class="create-room-form" @submit.prevent="createRoom">
          <label class="create-room-form-label">
            {{ $t('HOST.ROOM_LIST.ROOM_NAME_LABEL') }}
          </label>
          <input class="create-room-form-input" v-model="roomName">
          <button class="button create-room-form-button">{{ $t('HOST.ROOM_LIST.CREATE_BUTTON') }}</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { getLocalRefreshToken } from '@/api/auth'
import t from '@/services/translator'
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'AdminPanelPage',
  data () {
    return {roomName: ''}
  },
  computed: {
    ...mapState(['adminRooms', 'isAdmin']),
    ...mapGetters(['hasRoom']),
  },
  created () {
    if (!this.isAdmin) {
      const refresh_token = getLocalRefreshToken()
      if (!refresh_token) {
        this.$router.replace({name: 'OauthLogin'})
        return
      }
      this.$socket.emit('authenticate.refresh_token', refresh_token)
    }
  },
  methods: {
    createRoom () {
      if (!/^[\w-]{3,16}$/.test(this.roomName)) {
        this.$toastr.Add({type: 'error', msg: t('VALIDATION_CREATE_ROOM')})
        return
      }
      this.$socket.emit('admin.room.create', {room: this.roomName})
    },
    removeRoom (roomName) {
      if (confirm(t('CONFIRM_DELETE_ROOM'))) {
        this.$socket.emit('admin.room.remove', {room: roomName})
      }
    }
  }
}
</script>

<style scoped lang="scss">

.clickable {
  cursor: pointer;
}

.admin-panel {
  width: 360px;
  padding: 2rem 0 0;
  margin: auto;
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

.create-room {
  &-form {
    position: relative;
    z-index: 1;
    background: #fff;
    max-width: 360px;
    margin: 0 auto 100px;
    padding: 45px;
    text-align: center;
    box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.24);

    &-label {
      font-weight: bold;
    }

    &-input {
      outline: 0;
      background: #f2f2f2;
      width: 100%;
      border: 0;
      margin: 0 0 15px;
      padding: 15px;
      box-sizing: border-box;
      font-size: 14px;
    }

    &-button {
      width: 100%;
    }
  }
}
</style>
