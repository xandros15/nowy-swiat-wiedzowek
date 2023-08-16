<template>
  <div style="display: grid;">
    <small style="margin: .2rem">Możesz wybrać odpowiedzi do zbiorowych akcji</small>
    <div style="margin: .5rem .2rem; display: flex; justify-content: space-around;">
      <label  class="label" @click="select('points')">Punkty:</label>
      <input
          style="max-width: 40px;"
          ref="points"
          type="number"
          v-model.number="points"
      >
      <label class="label" @click="select('tiebreaker')">Tiebreaker:</label>
      <input
          style="max-width: 40px;"
          ref="tiebreaker"
          type="number"
          v-model.number="tiebreaker"
      >
    </div>
    <button @click="submit" style="width: 300px" class="button">Dodaj</button>
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
