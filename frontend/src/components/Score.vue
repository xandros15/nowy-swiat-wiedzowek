<template>
    <table class="table" v-if="score.length > 0">
        <thead>
        <tr>
            <th>Drużyna</th>
            <th>Punkty</th>
            <th>Tiebreakery</th>
        </tr>
        </thead>
        <tbody>
        <tr :key="k" v-for="(team, k) in score">
            <td>{{team.nickname}}</td>
            <td>{{team.points}}</td>
            <td>{{team.tiebreaker}}</td>
        </tr>
        </tbody>
    </table>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: "Score",
    computed: mapState(['score']),
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