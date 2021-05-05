<template>
    <div id="app">
        <h2 class="title">Punktacja</h2>
        <div class="flex">
            <Score/>
        </div>
    </div>
</template>

<script>
  import Score from '../components/Score'

  export default {
    name: 'ScorePage',
    components: {Score,},
    props: ['room'],
    created () {
      this.$store.dispatch('score.listen', {room: this.room})
    },
  }
</script>

<style lang="scss" scoped>
    .title {
        color: #f2f2f2;
        text-shadow: 2px 2px 2px #020202;
        padding: .83em;
        margin: 0;
    }

    .flex {
        padding: 1rem;
        display: flex;
        flex-direction: column;
    }
</style>
