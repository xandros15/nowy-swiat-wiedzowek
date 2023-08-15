<template>
  <div class="full-screen">
    <LoginPage :room="room" v-if="!isLogged"/>
    <div class="full-screen" v-else>
      <div class="top-bar">
        <div class="top-bar-left">
          <div class="place" v-if="takeover">
            {{t('TAKEOVER_LABEL')}} {{ place }}
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
import AnswerPage from '@/components/answer/AnswerPage'
import LoginPage from '@/components/panel/LoginPage'
import t from "@/services/translator";
import TakeoverLargeBtn from "@/components/answer/TakeoverLargeBtn";
import ModeBtn from "@/components/answer/ModeBtn";

const MODE_TAKEOVER = 'MODE_TAKEOVER'
const MODE_ANSWERS = 'MODE_ANSWERS'


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
    ...mapState({
      takeover: state => state.takeover,
    }),
    place() {
      return this.takeover.place === 1 ? '#1' : `#${this.takeover.place} (${this.takeover.time / 1000}s)`
    },
    isTakeoverMode() {
      return MODE_TAKEOVER === this.mode
    },
    modeLabel() {
      switch (this.mode) {
        case MODE_TAKEOVER:
          return t('MODE_TAKEOVER')
        case MODE_ANSWERS:
        default:
          return t('MODE_ANSWER')
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
    },
    t(input) {
      return t(input);
    }
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
  background: #bd7840;
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
