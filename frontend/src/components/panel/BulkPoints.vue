<template>
  <div style="display: grid;">
    <small style="margin: .2rem">{{$t('HOST.SCORE.BATCH_ACTION')}}</small>
    <div style="margin: .5rem .2rem; display: flex; justify-content: space-around;">
      <label  class="label" @click="select('points')">{{$t('HOST.SCORE.POINT_LABEL')}}:</label>
      <input
          style="max-width: 40px;"
          ref="points"
          type="number"
          v-model.number="points"
      >
      <label class="label" @click="select('tiebreaker')">{{$t('HOST.SCORE.TIEBREAKER_LABEL')}}:</label>
      <input
          style="max-width: 40px;"
          ref="tiebreaker"
          type="number"
          v-model.number="tiebreaker"
      >
    </div>
    <button @click="submit" style="width: 300px" class="button">{{$t('HOST.SCORE.SUBMIT')}}</button>
  </div>
</template>

<script>
  export default {
    name: "BulkPoints",
    data () {
      return {
        points: 1,
        tiebreaker: 0,
      }
    },
    methods: {
      select (ref) {
        this.$refs[ref].select()
      },
      submit () {
        this.$store.dispatch('admin.bulkpoints', {
          tiebreaker: this.tiebreaker,
          points: this.points,
        });
        this.tiebreaker = 0
        this.points = 1
      },
    },
  }
</script>

<style lang="scss" scoped>
.label {
  cursor: pointer;
  font-weight: bold;
}
</style>
