<template>
    <form @submit.prevent="sendAnswer">
        <div>
            <label for="answer">Odpowiedź</label>
            <input id="answer" v-model="answer">
        </div>
        <div>
            <label for="answer-alt">Odpowiedź dodatkowa</label>
            <input id="answer-alt" v-model="answerAlt">
        </div>
        <button>Wyślij</button>
    </form>
</template>

<script>
  export default {
    name: 'AnswerPage',
    data () {
      return {answer: '', answerAlt: ''}
    },
    methods: {
      sendAnswer () {
        this.$store.dispatch('answer', {answer: this.answer, answerAlt: this.answerAlt})
          .then(() => this.answer = this.answerAlt = '')
      }
    }
  }
</script>

<style scoped>
</style>
