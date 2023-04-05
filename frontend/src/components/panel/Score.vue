<template>
    <table class="table" v-if="score.length > 0">
        <thead>
        <tr>
            <th @click="sort('team')" class="sortable">Drużyna</th>
            <th>Fever</th>
            <th @click="sort('points')" class="sortable">Punkty</th>
            <th>Tiebreakery</th>
            <th v-if="isAdmin">Dodatki</th>
        </tr>
        </thead>
        <tbody>
        <TeamScore :isAdmin="isAdmin" :key="k" :team="team" :top="topScore" v-for="(team, k) in sorted"/>
        </tbody>
    </table>
</template>

<script>
  import { mapState } from 'vuex'
  import TeamScore from "@/components/TeamScore";

  export default {
    name: "Score",
    components: {TeamScore},
    props: {
      isAdmin: {
        type: Boolean,
        default: false,
      },
    },
    data: () => {
      return {
        sortType: ''
      }
    },
    computed: {
      sorted () {
        let score = [...this.score];
        if (this.sortType === 'team') {
          score.sort((a, b) => a.nickname.localeCompare(b.nickname));
        }
        if (!this.sortType || this.sortType === 'points') {
          score.sort((b, a) => a.points === b.points ? a.tiebreaker - b.tiebreaker : a.points - b.points)
        }

        return score
      },
      topScore () {
        let score = [...this.score];
        score.sort((a, b) => b.points - a.points)
        return score[0] ? score[0].points : 0
      },
      hasTiebreakers () {
        for (const team of this.score) {
          if (team.tiebreaker !== 0) {
            return true
          }
        }
        return false
      },
      ...mapState(['score'])
    },
    methods: {
      sort (type) {
        this.sortType = type
      },
    }
  }
</script>

<style lang="scss" scoped>
    .table {
        color: #363636;
        background-color: #fff;
        margin: .3rem;
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

        & tbody tr:nth-child(even), & tbody tr:hover {
            background-color: #fafafa;
        }
    }

    .sortable {
        cursor: pointer;
    }
</style>