<template>
  <div class="wrapper">
    <LoginPage :room="room" v-if="!isLogged"/>
    <div class="wrapper" v-else>
      <div class="mode-bar">
        <Btn @click.native="switchModes">{{ modeLabel }}</Btn>
      </div>
      <TakeoverPage class="takeover" v-if="isTakeoverMode"/>
      <AnswerPage v-else/>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import AnswerPage from '@/components/answer/AnswerPage'
import LoginPage from '@/components/panel/LoginPage'
import Btn from "@/components/Btn"
import TakeoverPage from "@/components/answer/TakeoverPage";
import t from "@/services/translator";

const MODE_TAKEOVER = 'MODE_TAKEOVER'
const MODE_ANSWERS = 'MODE_ANSWERS'


export default {
  name: 'TeamPage',
  props: ['room'],
  components: {
    TakeoverPage,
    AnswerPage,
    LoginPage,
    Btn,
  },
  created() {
    this.$toastr.defaultPosition = 'toast-top-center'
    this.$socket.emit('rooms')
  },
  sockets: {
    rooms (rooms) {
      if(rooms.indexOf(this.room) === -1){
        this.$toastr.e(t('ROOM_NO_EXISTS'))
        this.$router.replace({name: 'LobbyPage'})
      }
    }
  },
  data() {
    return {
      mode: MODE_ANSWERS,
    }
  },
  computed: {
    ...mapState(['isLogged']),
    isTakeoverMode() {
      return MODE_TAKEOVER === this.mode
    },
    modeLabel() {
      switch (this.mode) {
        case MODE_TAKEOVER:
          return 'ANSWERS MODE'
        case MODE_ANSWERS:
        default:
          return 'TAKEOVER MODE'
      }
    },
  },
  methods: {
    switchModes() {
      switch (this.mode) {
        case MODE_TAKEOVER:
          this.mode = MODE_ANSWERS
          break;
        case MODE_ANSWERS:
        default:
          this.mode = MODE_TAKEOVER
      }
    }
  }
}
</script>

<style lang="scss">
.wrapper {
  height: 100%;
}

.mode-bar {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 300;
}

.takeover {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
