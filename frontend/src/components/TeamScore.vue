<template>
    <tr :style="{backgroundColor: this.hasFever ? '#6bd375' : '#fafafa'}">
        <td>{{team.nickname}}</td>
        <td>{{feverCalc | feverPercent}}</td>
        <td>{{team.points}}</td>
        <td>{{team.tiebreaker}}</td>
        <td v-if="isAdmin">
            <button @click="addPoint(team.nickname)">+1 pkt</button>
            <button @click="removePoint(team.nickname)">-1 pkt</button>
        </td>
    </tr>
</template>

<script>
  import { mapActions } from 'vuex'

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
      ...mapActions({
        addPoint: 'admin.point.add',
        removePoint: 'admin.point.remove',
      }),
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
