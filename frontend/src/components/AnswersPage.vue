<template>
    <div>
        <h2 class="title">Odpowiedzi</h2>
        <div class="flex" v-if="answers.length > 0">
            <div class="button-group">
                <button @click="reset" class="button">Resetuj Odpowiedzi</button>
            </div>
            <table class="table">
                <thead>
                <tr>
                    <th>Drużyna</th>
                    <th>Anime</th>
                    <th>Dodatkowo</th>
                    <th>Opcje</th>
                </tr>
                </thead>
                <tbody>
                <tr :key="k" v-for="(answer, k) in answers">
                    <td>{{answer.nickname}}</td>
                    <td>{{answer.answer}}</td>
                    <td>{{answer.answerAlt}}</td>
                    <td>
                        <button @click="resetSingle(answer.nickname)">Usuń</button>
                        <button @click="pointAdd(answer.nickname)">+1 pkt</button>
                        <button @click="pointRemove(answer.nickname)">-1 pkt</button>
                        <button @click="tieAdd(answer.nickname)">+1 tie</button>
                        <button @click="tieRemove(answer.nickname)">-1 tie</button>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <h3 class="title" v-else>Nie ma jeszcze odpowiedzi.</h3>
        <div class="flex">
            <div class="flex-item">
                <router-link :to="{name: 'ScorePage', params: {room}}" class="a" target="_blank">
                    Otwórz punktacje w innej karcie
                </router-link>
            </div>
            <Score :isAdmin="true" class="flex-item"/>
            <div class="flex-item">
                <button @click="scoreReset" class="button">Resetuj Punkty</button>
            </div>
        </div>
    </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex'
  import Score from './Score'

  export default {
    name: 'AnswersPage',
    components: {Score},
    computed: mapState(['answers', 'room']),
    methods: mapActions({
      resetSingle: 'admin.reset.single',
      reset: 'admin.reset',
      pointRemove: 'admin.point.remove',
      pointAdd: 'admin.point.add',
      tieRemove: 'admin.tiebreaker.remove',
      tieAdd: 'admin.tiebreaker.add',
      scoreReset: 'admin.score.reset',
    }),
  }
</script>

<style lang="scss" scoped>
    .title {
        color: #f2f2f2;
        text-shadow: 2px 2px 2px #020202;
    }

    .a {
        text-decoration: none;
        color: #2c3e50;
        transition: color .3s;

        &:hover {
            color: #610d12;
        }
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

    .flex {
        display: flex;
        flex-direction: column;
        margin-bottom: .3rem;

        &-item {
            margin-bottom: .3rem;
        }
    }

    .table {
        color: #363636;
        background-color: #fff;
        margin: .3rem;
        border-collapse: collapse;
        border-spacing: 0;
        width: 100%;

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
