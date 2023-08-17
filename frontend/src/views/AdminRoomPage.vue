<template>
  <div>
    <Answers class="block"/>
    <Takeovers class="block"/>
    <Score class="block" :room="room"/>
    <QRLink style="margin-top: 1rem" class="block" :room="room"/>
  </div>
</template>

<script>
import Takeovers from '@/components/panel/Takeovers'
import Score from '@/components/panel/Score'
import QRLink from "@/components/panel/QRLink";
import Answers from "@/components/panel/Answers";

export default {
  name: 'AnswersPage',
  components: {
    QRLink,
    Takeovers,
    Score,
    Answers
  },
  props: ['room'],
  created() {
    this.$socket.emit('admin.room.join', {room: this.room})
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
