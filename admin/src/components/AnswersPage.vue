<template>
    <div>
        <h2>Odpowiedzi</h2>
        <div v-if="answers.length > 0">
            <button @click="reset">Resetuj</button>
            <table>
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
        <h3 v-else>Nie ma jeszcze odpowiedzi.</h3>
    </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex'

  export default {
    name: 'AnswersPage',
    computed: mapState(['answers']),
    methods: mapActions({reset: 'reset'}),
  }
</script>

<style scoped>
</style>
