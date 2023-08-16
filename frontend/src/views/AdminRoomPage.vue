<template>
  <div>
    <Answers/>
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

.tb-number {
  width: 5px
}

.mb-1 {
  margin-bottom: .3rem;
}

.mt-1 {
  margin-top: .3rem;
}


.tb-25 {
  width: 25%;
}

.a {
  text-decoration: none;
  color: #2c3e50;
  transition: color .3s;

  &:hover {
    color: #610d12;
  }
}

.block {
  display: flex;
  flex-direction: column;
  margin-bottom: .3rem;

  &-item {
    margin-bottom: .3rem;
  }
}

</style>
