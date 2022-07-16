<template>
    <div>
        <h2 class="title">Odpowiedzi</h2>
        <div class="block" v-if="answers.length > 0">
            <div class="button-group">
                <Btn @click="reset" class="button">Resetuj Odpowiedzi</Btn>
            </div>
            <BulkPoints/>
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
                <tr :class="{selected: selected.indexOf(answer.nickname) !== -1}" :key="k"
                    v-for="(answer, k) in answers">
                    <td @click.prevent="toggleSelect(answer.nickname)" class="tb-25 clickable">{{answer.nickname}}</td>
                    <td @click.prevent="toggleSelect(answer.nickname)" class="tb-25 clickable">{{answer.answer}}</td>
                    <td @click.prevent="toggleSelect(answer.nickname)" class="tb-25 clickable">{{answer.answerAlt}}</td>
                    <td class="tb-25">
                        <button @click="resetSingle(answer.nickname)">Usuń</button>
                        <button @click="pointAdd(answer.nickname)">+1 pkt</button>
                        <button @click="pointRemove(answer.nickname)">-1 pkt</button>
                        <button @click="tieAdd(answer.nickname)">+1 tie</button>
                        <button @click="tieRemove(answer.nickname)">-1 tie</button>
                    </td>
                </tr>
                </tbody>
            </table>
            <small>Możesz wybrać odpowiedzi do zbiorowych akcji</small>
        </div>
        <h3 class="title" v-else>Nie ma jeszcze odpowiedzi.</h3>
        <div class="block">
            <div class="block">
                <router-link :to="{name: 'ScorePage', params: {room}}" class="a" target="_blank">
                    Otwórz punktacje w innej karcie
                </router-link>
            </div>
            <Score :isAdmin="true" class="flex-item"/>
            <div class="block-item">
                <Btn @click="scoreReset" class="button">Resetuj Punkty</Btn>
            </div>
        </div>
    </div>
</template>

<script>
  import { mapActions, mapMutations, mapState } from 'vuex'
  import Btn from './Btn'
  import BulkPoints from './BulkPoints'
  import Score from './Score'

  export default {
    name: 'AnswersPage',
    components: {Btn, BulkPoints, Score},
    computed: mapState(['answers', 'room', 'selected']),
    methods: {
      ...mapMutations({
        selectAnswer: 'selectAnswer',
        unselectAnswer: 'unselectAnswer',
      }),
      ...mapActions({
        resetSingle: 'admin.reset.single',
        reset: 'admin.reset',
        pointRemove: 'admin.point.remove',
        pointAdd: 'admin.point.add',
        tieRemove: 'admin.tiebreaker.remove',
        tieAdd: 'admin.tiebreaker.add',
        scoreReset: 'admin.score.reset',
      }),
      toggleSelect (nickname) {
        if (this.selected.indexOf(nickname) === -1) {
          this.selectAnswer(nickname)
        } else {
          this.unselectAnswer(nickname)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
    .clickable {
        cursor: pointer;
    }

    .title {
        color: #f2f2f2;
        text-shadow: 2px 2px 2px #020202;
        padding: .83em;
        margin: 0;
    }

    .tb-25 {
        width: 25%;
    }

    .a {
        text-decoration: none;
        color: #2c3e50;
        transition: color .3s;

        &:hover {
            color: #610d12;
        }
    }

    /*.button {*/
    /*    text-transform: uppercase;*/
    /*    outline: 0;*/
    /*    background: #b84d08;*/
    /*    border: 0;*/
    /*    padding: 15px;*/
    /*    color: #fff;*/
    /*    font-size: 14px;*/
    /*    cursor: pointer;*/

    /*    &:hover, &:active, &:focus {*/
    /*        background: #d15208;*/

    /*    }*/
    /*}*/

    .block {
        display: flex;
        flex-direction: column;
        margin-bottom: .3rem;
        padding: 1rem;

        &-item {
            margin-bottom: .3rem;
        }
    }

    .table {
        color: #363636;
        background-color: #fff;
        margin: 0 .3rem;
        border-collapse: collapse;
        border-spacing: 0;
        width: 100%;

        & .selected {
            background-color: rgb(107, 211, 117) !important;

            &:hover {
                background-color: rgb(96, 192, 97) !important;
            }
        }

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
