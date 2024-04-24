<template>
  <div id="score-page">
    <h2 class="title">{{ $t('SCOREBOARD.TITLE') }}</h2>
    <div class="grid" v-if="sorted.length > 0">
      <div v-for="(team,v) in sorted" :key="v" class="standing" :class="`place-${team.place}`">
        <div class="place" :class="`place-${team.place}`">
          {{ team.place }}.
        </div>
        <div class="team-name">
          <span v-if="team.hasFever" style="font-size: 80%;">🔥</span>
          {{ team.nickname }}
          <span class="points">
            ({{ team.points }}P/{{ team.tiebreaker }}T)
          </span>
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

        function getPlace(current, previous) {
          if (!previous) {
            return 1;
          }

          if (
              current.points === previous.points
              && current.tiebreaker === previous.tiebreaker
          ) {
            return previous.place;
          }

          return previous.place + 1;
        }

        const topPoints = score[0] ? score[0].points : 0
        for (const key in score) {
          sorted[key] = {
            place: getPlace(score[key], sorted[key - 1]),
            hasFever: (score[key].points / Math.max(topPoints, 1)) > 0.66,
            ...score[key],
          }
        }

        return sorted
      },
      ...mapState(['score']),
    },
    created() {
      this.$store.dispatch('score.listen', {room: this.room})
    },
  }
</script>

<style lang="scss" scoped>
.title {
  font-size: 60px;
  background: rgba(0, 0, 0, 0.83);
  color: #f2f2f2;
  padding: .5rem;
  display: block;
  margin: .3rem 0;
}

.grid {
  margin: 1rem 4rem;
  padding: 1rem;
}

.standing {
  text-align: left;
  font-size: 36px;
  font-weight: 700;
  color: #eeeeee;
  display: grid;
  grid-template-columns: 3em 1fr;
  grid-gap: .3em;
  margin-bottom: .3em;

  &:hover,
  &:focus {
    & .place,
    & .team-name {
      background: rgba(0, 0, 0, 0.50);
    }
  }
}

.points {
  float: right;
}

.place {
  position: relative;
  text-align: right;
  padding: .3rem .5rem;
  background: rgba(0, 0, 0, 0.83);

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

.team-name {
  padding: .3rem .7rem;
  background: rgba(0, 0, 0, 0.83);
}
</style>
