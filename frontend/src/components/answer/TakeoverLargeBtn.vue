<template>
  <button @click="sendTakeover"
          @touchstart="sendTakeover"
          class="takeover-button"
          :class="isTakeover ? 'takeover-button__red' : 'takeover-button__green'">
    Takeover
  </button>
</template>

<script>
export default {
  name: "TakeoverLargeBtn",
  props: {
    isTakeover: {required: true}
  },
  created () {
    document.body.addEventListener('keyup', ev => {
      if (!this.isTakeover && ev.code === 'Space') {
        this.sendTakeover(ev)
      }
    })
  },
  methods: {
    sendTakeover() {
      this.$store.dispatch('takeover')
    },
  }
}
</script>

<style lang="scss" scoped>
.takeover-button {
  /** reset start **/
  border: none;
  margin: 0;
  padding: 0;
  overflow: visible;
  background: transparent;
  color: inherit;
  font: inherit;
  line-height: normal;
  -webkit-font-smoothing: inherit;
  -moz-osx-font-smoothing: inherit;
  -webkit-appearance: none;
  /** reset end **/
  width: 100%;
  height: 100%;
  font-size: 20vw;

  &::-moz-focus-inner {
    border: 0;
    padding: 0;
  }

  &__red {
    color: #fff;
    background-color: #ff6662;
  }

  &__green {
    color: #000;
    background-color: #43a047;
  }
}
</style>