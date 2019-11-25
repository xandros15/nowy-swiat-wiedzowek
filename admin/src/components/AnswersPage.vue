<template>
    <div>
        <h2>Odpowiedzi</h2>
        <ul>
            <li :key="k" v-for="(answer, k) in answers">
                {{answer.nickname}} a: {{answer.answer}} m: {{answer.answerAlt}}
            </li>
        </ul>
    </div>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'AnswersPage',
    computed: mapState(['answers'])
  }
</script>

<style scoped>
</style>
