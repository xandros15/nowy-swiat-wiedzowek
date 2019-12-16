<template>
    <div class="status">status: <span :class="status.toLowerCase()">{{status}}</span></div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: "StatusBar",
    computed: {
      ...mapGetters(['status'])
    }
  }
</script>

<style lang="scss" scoped>
    .status {
        position: absolute;
        padding: .5rem;
        bottom: 0;

        & > .connected {
            color: #045b00;
        }

        & > .connecting {
            color: #dcd116;
        }

        & > .disconnect {
            color: #63000d;
        }
    }
</style>
