<template>
    <div>
        <h2 class="title">Odpowiedzi</h2>
        <div class="flex" v-if="answers.length > 0">
            <div class="button-group">
                <button @click="reset" class="button">Resetuj</button>
            </div>
            <table class="table">
                <thead>
                <tr>
                    <th>Drużyna</th>
                    <th>Anime</th>
                    <th>Dodatkowo</th>
                </tr>
                </thead>
                <tbody>
                <tr :key="k" v-for="(answer, k) in answers">
                    <td>{{answer.nickname}}</td>
                    <td>{{answer.answer}}</td>
                    <td>{{answer.answerAlt}}</td>
                </tr>
                </tbody>
            </table>
        </div>
        <h3 class="title" v-else>Nie ma jeszcze odpowiedzi.</h3>
    </div>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'AnswersPage',
    props: ['room'],
    computed: mapState({
      answers (state) {
        return state.answers.filter(answer => answer.room === this.room)
      }
    }),
    methods: {
      reset () {
        this.$store.dispatch('admin.reset', this.room)
      }
    }
  }
</script>

<style lang="scss" scoped>
    .title {
        color: #f2f2f2;
        text-shadow: 2px 2px 2px #020202;
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
