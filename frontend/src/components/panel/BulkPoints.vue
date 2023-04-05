<template>
    <div class="bulk-points">
        <div class="bulk-points-body">
            <span class="bulk-points-label">Dla zaznaczonych:
                <button @click="submit" class="bulk-points-button">Dodaj</button>
            </span>
            <label @click="select('points')" class="bulk-points-label">Punkty:
                <input class="bulk-points-input"
                       ref="points"
                       type="number"
                       v-model.number="points"
                >
            </label>
            <label @click="select('tiebreaker')" class="bulk-points-label">Tie:
                <input class="bulk-points-input"
                       ref="tiebreaker"
                       type="number"
                       v-model.number="tiebreaker"
                >
            </label>
        </div>
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
    .bulk-points {
        display: inline-block;
        padding: .5rem;
        color: #eee;
        text-shadow: 1px 1px 5px #000;
        background-color: var(--bg-color-1);
        font-weight: bold;
        margin: 1rem auto 0;

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

        &-button {
            font-weight: bold;
            text-transform: uppercase;
            outline: 0;
            background: #fff;
            border: 1px solid #333;
            padding: .3rem;
            color: #333;
            font-size: 14px;
            cursor: pointer;

            &:hover, &:active, &:focus {
                background: #eee;

            }
        }
    }
</style>
