<template>
    <form @submit.prevent="sendAnswer">
        <div>
            <label for="answer">Anime: </label>
            <input :value="answer" id="answer" ref="answer">
        </div>
        <div>
            <label for="answer-alt">Dodatkowe dane: </label>
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
        const payload = {
          answer: this.$refs.answer.value.trim(),
          answerAlt: this.$refs.answerAlt.value.trim(),
        }
        if (payload.answer.length < 1 || payload.answer.length > 64 || payload.answerAlt.length > 64) {
          alert('Twoja odpowiedź jest za długa lub za krótka')
        } else {
          this.$store.dispatch('answer', payload)
        }
      }
    }
  }
</script>

<style scoped>
</style>
