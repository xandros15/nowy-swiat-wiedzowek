<template>
  <button @click="click"
          @touchstart="click"
          class="takeover-button"
          :class="isTakeover ? 'takeover-button__red' : 'takeover-button__green'">
    TAKEOVER
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
        this.click(ev)
      }
    })
  },
  methods: {
    click (ev) {
      this.$emit('click', ev)
    },
  }
}
</script>

<style lang="scss" scoped>
.takeover-button {
  /** reset start **/
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

  font-size: 10vb;
  border-radius: 80vh;
  border: 2px solid black;
  width: 80vh;
  height: 80vh;

  &::-moz-focus-inner {
    border: 0;
    padding: 0;
  }

  &__red {
    color: #fff;
    background-color: #cb4340;
  }

  &__green {
    color: #000;
    background-color: #39c73e;
  }
}
</style>