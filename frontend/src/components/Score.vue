<template>
    <table class="table" v-if="score.length > 0">
        <thead>
        <tr>
            <th @click="sort('team')">Drużyna</th>
            <th @click="sort('points')">Punkty</th>
            <th>Tiebreakery</th>
            <th v-if="isAdmin">Powiadomienia</th>
        </tr>
        </thead>
        <tbody>
        <tr :key="k" v-for="(team, k) in sorted">
            <td>{{team.nickname}}</td>
            <td>{{team.points}}</td>
            <td>{{team.tiebreaker}}</td>
            <td v-if="isAdmin">
                <button @click="notify({type:'turn', name:team.nickname})">Tura</button>
                <button @click="notify({type:'correct', name:team.nickname})">Poprawna</button>
                <button @click="notify({type:'incorrect', name:team.nickname})">Niepoprawna</button>
            </td>
        </tr>
        </tbody>
    </table>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: "Score",
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
        const score = this.score;
        if (this.sortType === 'team') {
          score.sort((a, b) => a.nickname.localeCompare(b.nickname));
        }
        if (this.sortType === 'points') {
          score.sort((a, b) => a.points === b.points ? a.tiebreaker - b.tiebreaker : a.points - b.points)
        }

        return score
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
      notify ({type, name}) {
        switch (type) {
          case 'turn':
            this.$store.dispatch('admin.notify', {
              type: 'warning', message: `Za chwilę zacznie się tura ${name}, bądźcie gotowi.`,
            })
            break;
          case 'correct':
            this.$store.dispatch('admin.notify', {
              type: 'success', message: `${name} odpowiedział poprawnie.`,
            })
            break;
          case 'incorrect':
            this.$store.dispatch('admin.notify', {
              type: 'error', message: `${name} odpowiedział niepoprawnie.`,
            })
            break;
          default:
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
    .flex {
        display: flex;
        flex-direction: column;
    }

    .button {
        text-transform: uppercase;
        outline: 0;
        background: #b84d08;
        border: 0;
        padding: 15px;
        color: #fff;
        font-size: 14px;
        cursor: pointer;

        &:hover, &:active, &:focus {
            background: #d15208;

        }
    }

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
            cursor: pointer;
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
</style>