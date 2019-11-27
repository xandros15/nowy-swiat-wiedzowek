<template>
    <div class="answer-wrapper">
        <div class="answer-container">
            <form @submit.prevent="sendAnswer" class="answer-form">
                <div>
                    <label class="answer-form-label" for="answer">Anime: </label>
                    <input :value="answer" autocomplete="off" class="answer-form-input" id="answer" ref="answer">
                </div>
                <div>
                    <label class="answer-form-label" for="answer-alt">Dodatkowe dane: </label>
                    <input :value="answerAlt" autocomplete="off" class="answer-form-input" id="answer-alt"
                           ref="answerAlt">
                </div>
                <button class="answer-form-button">Wyślij</button>
            </form>
        </div>
    </div>
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

<style lang="scss" scoped>
    .answer {
        &-container {
            width: 360px;
            padding: 8% 0 0;
            margin: auto;
        }

        &-form {
            position: relative;
            z-index: 1;
            background: #fff;
            max-width: 360px;
            margin: 0 auto 100px;
            padding: 45px;
            text-align: center;
            box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.24);

            &-label {
                font-weight: bold;
            }

            &-input {
                outline: 0;
                background: #f2f2f2;
                width: 100%;
                border: 0;
                margin: 0 0 15px;
                padding: 15px;
                box-sizing: border-box;
                font-size: 14px;
            }

            &-button {
                text-transform: uppercase;
                outline: 0;
                background: #b84d08;
                width: 100%;
                border: 0;
                padding: 15px;
                color: #fff;
                font-size: 14px;
                cursor: pointer;

                &:hover, &:active, &:focus {
                    background: #d15208;

                }
            }
        }
    }
</style>
