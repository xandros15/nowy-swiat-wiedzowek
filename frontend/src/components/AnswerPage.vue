<template>
    <form @submit.prevent="sendAnswer">
        <div>
            <label for="answer">Odpowiedź</label>
            <input :value="answer" id="answer" ref="answer">
        </div>
        <div>
            <label for="answer-alt">Odpowiedź dodatkowa</label>
            <input :value="answerAlt" id="answer-alt" ref="answerAlt">
        </div>
        <button>Wyślij</button>
    </form>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'AnswerPage',
    computed: mapState({
      answer: state => state.answer,
      answerAlt: state => state.answerAlt,
    }),
    methods: {
      sendAnswer () {
        this.$store.dispatch('answer', {
          answer: this.$refs.answer.value,
          answerAlt: this.$refs.answerAlt.value,
        })
      }
    }
  }
</script>

<style scoped>
</style>
