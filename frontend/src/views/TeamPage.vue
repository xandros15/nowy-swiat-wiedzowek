<template>
  <div class="full-screen">
    <LoginPage :room="room" v-if="!isLogged"/>
    <div class="full-screen" v-else>
      <div class="top-bar">
        <div class="top-bar-left">
          <div class="place" v-if="takeover">
            {{ $t('TAKEOVER_LABEL') }} {{ place }}
          </div>
        </div>
        <div class="top-bar-right">
          <ModeBtn class="mode-btn" @click.native="switchModes" :label="modeLabel"/>
        </div>
      </div>
      <TakeoverLargeBtn v-if="isTakeoverMode" :is-takeover="takeover"/>
      <AnswerPage v-else/>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import AnswerPage from '@/components/answer/AnswerPage.vue'
import LoginPage from '@/components/LoginPage.vue'
import TakeoverLargeBtn from "@/components/answer/TakeoverLargeBtn.vue"
import ModeBtn from "@/components/answer/ModeBtn.vue"
import socket from '@/services/socket'
import {error} from "@/services/toastr";

const MODE_TAKEOVER = 'MODE_TAKEOVER'
const MODE_ANSWER = 'MODE_ANSWER'


export default {
  name: 'TeamPage',
  props: ['room'],
  components: {
    ModeBtn,
    TakeoverLargeBtn,
    AnswerPage,
    LoginPage,
  },
  created() {
    socket.once('rooms', async rooms => {
      if (rooms.indexOf(this.room) === -1) {
        error('ROOM_NO_EXISTS', true)
        await this.$router.replace({name: 'LobbyPage'})
      }
    })
    socket.emit('rooms')
  },
  data() {
    return {
      mode: MODE_ANSWER,
    }
  },
  computed: {
    ...mapState(['isLogged']),
    ...mapState({
      takeover: state => state.takeover,
    }),
    modeLabel() {
      switch (this.mode) {
        case MODE_TAKEOVER:
          return this.$t(MODE_ANSWER);
        case MODE_ANSWER:
        default:
          return this.$t(MODE_TAKEOVER)
      }
    },
    place() {
      return this.takeover.place === 1 ? '#1' : `#${this.takeover.place} (${this.takeover.time / 1000}s)`
    },
    isTakeoverMode() {
      return MODE_TAKEOVER === this.mode
    },
  },
  methods: {
    switchModes() {
      switch (this.mode) {
        case MODE_TAKEOVER:
          this.mode = MODE_ANSWER
          break;
        case MODE_ANSWER:
        default:
          this.mode = MODE_TAKEOVER
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.top-bar {
  top: 0;
  font-weight: bold;
  display: grid;
  grid-template-columns: repeat(2, 50%);
  position: fixed;
  width: 100%;
  background: var(--bg-color-2);
  box-shadow: rgba(0, 0, 0, 0.66) 0 1px 10px 0;

  &-right {
    text-align: right;
  }

  &-left {
    text-align: left;
    display: flex;
    align-items: center;
  }

  .place {
    margin-left: 1rem;
    padding: .3rem
  }
}

</style>
