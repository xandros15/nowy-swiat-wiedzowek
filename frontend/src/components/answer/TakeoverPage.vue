<template>
  <div>
    <div class="place" v-if="takeover">{{ place }}</div>
    <TakeoverLargeBtn class="btn" @click="sendTakeover" :is-takeover="takeover"/>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import TakeoverLargeBtn from "@/components/answer/TakeoverLargeBtn";

export default {
  name: 'TakeoverPage',
  components: {TakeoverLargeBtn},
  computed: {
    ...mapState({
      takeover: state => state.takeover,
    }),
    place() {
      return this.takeover.place === 1 ? '#1' : `#${this.takeover.place} (${this.takeover.time / 1000}s)`
    },
  },
  methods: {
    sendTakeover() {
      this.$store.dispatch('takeover')
    },
  }
}
</script>

<style lang="scss" scoped>
.btn {
  margin-top: 4rem;
}
.place {
  color: #000;
  top: 0;
  left: 0;
  min-height: 48px;
  padding: .1rem 1rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  position: fixed;
  background: var(--bg-color-1);
  border-bottom: 2px solid #000;
  border-right: 2px solid #000;
}
</style>
