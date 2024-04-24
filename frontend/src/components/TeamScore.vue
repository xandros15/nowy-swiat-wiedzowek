<template>
  <tr>
    <td>{{ team.number }}</td>
    <td><span v-if="hasFever">🔥</span>{{ team.nickname }}</td>
    <td>{{ feverCalc | feverPercent }}</td>
    <td>{{ team.points }}</td>
    <td>{{ team.tiebreaker }}</td>
    <td>
      <div style="width: 315px">
        <button @click="addPoint(team.nickname)">{{ $t('HOST.SCORESHEET.ADD_POINT') }}</button>
        <button @click="add3Points(team.nickname)">{{ $t('HOST.SCORESHEET.ADD_3_POINTS') }}</button>
        <button @click="addTiebreaker(team.nickname)">{{ $t('HOST.SCORESHEET.ADD_TIEBREAKER') }}</button>
        <button @click="removePoint(team.nickname)">{{ $t('HOST.SCORESHEET.DEL_POINT') }}</button>
        <button @click="zeroPoint(team.nickname)">{{ $t('HOST.SCORESHEET.SET_ZERO') }}</button>
        <button @click="removeTeam(team.nickname)">{{ $t('HOST.SCORESHEET.DELETE') }}</button>
      </div>
    </td>
  </tr>
</template>

<script>
  import { mapActions } from 'vuex'

  export default {
    name: "TeamScore",
    props: ['team', 'top', 'order'],
    filters: {
      feverPercent(value) {
        return Math.round(value * 100) + '%'
      }
    },
    computed: {
      hasFever() {
        return (this.team.points / Math.max(this.top, 1)) > 0.66
      },
      feverCalc() {
        return Math.max(0, this.team.points / Math.max(this.top, 1))
      },
    },
    methods: {
      ...mapActions({
        addPoint: 'admin.point.add',
        removePoint: 'admin.point.remove',
        add3Points: 'admin.point.add.3',
        addTiebreaker: 'admin.tiebreaker.add',
        zeroPoint: 'admin.point.zero',
        removeTeam: 'admin.nickname.remove',
      }),
    }
  }
</script>

<style lang="scss" scoped>
td {
  text-align: left;
  border: 1px solid #dbdbdb;
  padding: .5em .75em;
  vertical-align: top;

  &:hover {

  }
}
</style>
