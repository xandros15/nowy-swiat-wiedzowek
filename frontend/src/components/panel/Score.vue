<template>
  <section class="card">
    <header class="card-header grid-2">
      <div class="left">
        <h2>Punktacja</h2>
      </div>
      <div class="right input-group">
        <form @submit.prevent="addNewTeam">
          <input placeholder="nazwa drużyny" title="nazwa drużyny" v-model="teamName">
          <button>Dodaj drużynę</button>
        </form>
      </div>
    </header>
    <table class="table card-body">
      <thead>
      <tr>
        <th @click="sort(null)" class="sortable">#</th>
        <th @click="sort('team')" class="sortable">Drużyna</th>
        <th>Fever</th>
        <th @click="sort('points')" class="sortable">Punkty</th>
        <th>Tiebreakery</th>
        <th style="width: 215px">Dodatki</th>
      </tr>
      </thead>
      <tbody v-if="score.length > 0">
      <TeamScore
          :order="k + 1"
          :key="k"
          :team="team"
          :top="topScore"
          v-for="(team, k) in sorted"
      />
      </tbody>
      <tbody v-else>
      <tr>
        <td class="empty" colspan="6">Nie znaleziono drużyn</td>
      </tr>
      </tbody>
    </table>
    <footer class="grid-2">
      <div class="left">
        <router-link :to="{name: 'ScorePage', params: {room}}" class="button" target="_blank">
          Otwórz punktacje w innej karcie
        </router-link>
      </div>
      <div class="right flex">
        <button @click="scoreReset" class="button button-danger">Resetuj Punkty</button>
      </div>
    </footer>
  </section>
</template>

<script>
import {mapActions, mapState} from 'vuex'
import TeamScore from "@/components/TeamScore";

export default {
  name: "Score",
  components: {TeamScore},
  props: ['room'],
  data: () => {
    return {
      sortType: '',
      teamName: '',
    }
  },
  computed: {
    ...mapState(['score']),
    sorted() {
      let score = [...this.score];
      if (this.sortType === 'team') {
        score.sort((a, b) => a.nickname.localeCompare(b.nickname));
      }
      if (this.sortType === 'points') {
        score.sort((b, a) => a.points === b.points ? a.tiebreaker - b.tiebreaker : a.points - b.points)
      }

      return score
    },
    topScore() {
      let score = [...this.score];
      score.sort((a, b) => b.points - a.points)
      return score[0] ? score[0].points : 0
    },
  },
  methods: {
    ...mapActions({
      scoreReset: 'admin.score.reset',
    }),
    sort(type) {
      this.sortType = type
    },
    addNewTeam() {
      if (this.teamName.length > 0) {
        this.$store.dispatch('admin.team.register', this.teamName)
        this.teamName = ''
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.left {
  text-align: left;
  justify-content: left;
}

.right {
  text-align: right;
  justify-content: right;
}

.flex {
  display: flex;
}

.card {
  color: #363636;
  background-color: #fff;
  margin: .3rem;
  border: 0 solid transparent;
  border-radius: .3rem;
  overflow: auto;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, .2), 0 5px 5px 0 rgba(0, 0, 0, .24);

  &-header {
    margin: 0 1rem;
  }
}

.input-group {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  justify-content: right;
  align-items: center;
  width: 100%;
}

.grid-2 {
  display: grid;
  grid-template-columns: repeat(2, 50%);
}

.table {
  border-collapse: collapse;
  border-spacing: 0;

  & th, & td {
    text-align: left;
    border: 1px solid #dbdbdb;
    padding: .5em .75em;
    vertical-align: top;
  }

  & thead, & tbody {
    background-color: transparent
  }

  & thead td, & thead th {
    color: #363636;
  }

  & tbody tr:hover:nth-child(even) {
    background-color: #f5f5f5;
  }

  & tbody tr:nth-child(even),
  & tbody tr:hover {
    background-color: #fafafa;
  }

  & td.empty {
    font-style: italic;
    text-align: center;
    color: #363636;
    background-color: #fafafa;
  }
}

.sortable {
  cursor: pointer;
  padding-right: 18px;
  position: relative;

  &:before,
  &:after {
    border: 4px solid transparent;
    content: "";
    display: block;
    height: 0;
    right: 5px;
    top: 50%;
    position: absolute;
    width: 0;
  }

  &:before {
    border-bottom-color: #666;
    margin-top: -9px;
  }

  &:after {
    border-top-color: #666;
    margin-top: 1px;
  }
}
</style>