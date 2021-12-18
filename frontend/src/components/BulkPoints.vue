<template>
    <div class="bulk-points">
        <div class="bulk-points-head">Dla zaznaczonych:
            <button @click="submit">Dodaj</button>
        </div>
        <div class="bulk-points-body">
            <label class="bulk-points-label">Punkty:<input class="bulk-points-input" type="number"
                                                           v-model.number="points"></label>
            <label class="bulk-points-label">Tie:<input class="bulk-points-input" type="number"
                                                        v-model.number="tiebreaker"></label>
        </div>
    </div>
</template>

<script>
  export default {
    name: "BulkPoints",
    data () {
      return {
        points: 0,
        tiebreaker: 0,
      }
    },
    methods: {
      submit () {
        this.$store.dispatch('admin.bulkpoints', {
          tiebreaker: this.tiebreaker,
          points: this.points,
        });
        this.tiebreaker = 0
        this.points = 0
      },
    },
  }
</script>

<style lang="scss" scoped>
    .bulk-points {
        display: inline-block;
        margin: 1rem auto;
        padding: .5rem;
        color: #eee;
        text-shadow: 1px 1px 1px #000;
        background-color: #b84d08;

        &-head {
            margin-bottom: .5rem;
        }

        &-input {
            max-width: 30px;
            margin-left: .1rem;
        }

        &-label {
            margin-right: .3rem;
        }
    }
</style>
