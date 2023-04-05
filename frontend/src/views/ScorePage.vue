<template>
  <div id="score-page">
    <h2 class="title">Punktacja</h2>
    <div class="grid" v-if="score.length > 0">
      <div v-for="(team,v) in sorted" :key="v">
        <div class="team-name place" :class="`place-${team.place}`">
          {{ team.place }}.
          {{ team.nickname }}
          ({{ team.points }}P/{{ team.tiebreaker }}T)
          <span v-if="team.hasFever" style="font-size: 80%;">🔥</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from "vuex";

  export default {
    name: 'ScorePage',
    components: {},
    props: ['room'],
    computed: {
      sorted() {
        let score = [...this.score];
        score.sort((b, a) => a.points === b.points ? a.tiebreaker - b.tiebreaker : a.points - b.points)
        let sorted = [];

        function getPlace(key) {
          let place = Number.parseInt(key) + 1;
          if (
              score[key - 1]//exist
              && score[key - 1].points === score[key].points //same points
              && score[key - 1].tiebreaker === score[key].tiebreaker //same tiebreakers
          ) {
            place--
          }

          return place;
        }

        const topPoints = score[0] ? score[0].points : 0
        for (const key in score) {
          sorted.push({
            place: getPlace(key),
            hasFever: (score[key].points / Math.max(topPoints, 1)) > 0.66,
            ...score[key],
          })
        }

        return sorted
      },
      ...mapState(['score'])
    },
    created() {
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

.grid {
  margin: 1rem 4rem;
  padding: 1rem;
  display: grid;
  background: rgba(0, 0, 0, 0.83);
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 1rem;
  @media (max-width: 1024px) {
    grid-template-columns: repeat(1, 1fr);
  }
}


.team-name {
  position: relative;
  font-size: 32px;
  font-weight: 700;
  color: #eeeeee;

  &.place-1:before {
    content: '🥇';
    font-size: 80%;
    z-index: -1;
  }

  &.place-2:before {
    content: '🥈';
    font-size: 80%;
    z-index: -1;
  }

  &.place-3:before {
    content: '🥉';
    font-size: 80%;
    z-index: -1;
  }
}
</style>
