<template>
  <div>
    <Answers class="block"/>
    <Takeovers class="block"/>
    <Score class="block" :room="room"/>
    <History class="block"/>
    <div class="block">
      <QRLink :room="room"/>
    </div>
  </div>
</template>

<script>
import Takeovers from '@/components/panel/Takeovers.vue'
import Score from '@/components/panel/Score.vue'
import QRLink from "@/components/panel/QRLink.vue";
import Answers from "@/components/panel/Answers.vue";
import socket from '@/services/socket'
import History from "@/components/panel/History.vue";

export default {
  name: 'AnswersPage',
  components: {
    History,
    QRLink,
    Takeovers,
    Score,
    Answers
  },
  props: ['room'],
  created() {
    socket.emit('admin.room.join', {room: this.room})
  },
}
</script>

<style lang="scss" scoped>

.block {
  display: flex;
  flex-direction: column;
  margin: 1rem;
}

</style>
