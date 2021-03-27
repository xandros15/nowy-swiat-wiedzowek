<template>
    <tr :style="{backgroundColor: this.hasFever ? '#6bd375' : '#fafafa'}">
        <td>{{team.nickname}}</td>
        <td>{{feverCalc | feverPercent}}</td>
        <td>{{team.points}}</td>
        <td>{{team.tiebreaker}}</td>
        <td v-if="isAdmin">
            <button @click="notify({type:'turn', name:team.nickname})">Tura</button>
            <button @click="notify({type:'correct', name:team.nickname})">Poprawna</button>
            <button @click="notify({type:'incorrect', name:team.nickname})">Niepoprawna</button>
        </td>
    </tr>
</template>

<script>
  export default {
    name: "TeamScore",
    props: ['team', 'top', 'isAdmin'],
    filters: {
      feverPercent (value) {
        return Math.round(value * 100) + '%'
      }
    },
    computed: {
      hasFever () {
        return (this.team.points / Math.max(this.top, 1)) > 0.66
      },
      feverCalc () {
        return this.team.points / Math.max(this.top, 1)
      },
    },
    methods: {
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

<style scoped>
    td {
        text-align: left;
        border: 1px solid #dbdbdb;
        padding: .5em .75em;
        vertical-align: top;
        cursor: pointer;
    }
</style>
