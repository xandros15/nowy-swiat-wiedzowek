<template>
    <div>
        <h2>Odpowiedzi</h2>
        <button @click="reset">Resetuj</button>
        <ul>
            <li :key="k" v-for="(answer, k) in answers">
                {{answer.nickname}} a: {{answer.answer}} m: {{answer.answerAlt}}
            </li>
        </ul>
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
