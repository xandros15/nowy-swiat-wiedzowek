<template>
    <div class="answer-wrapper">
        <Logo/>
        <div class="answer-container">
            <form @submit.prevent="sendAnswer" class="answer-form">
                <div>
                    <label class="answer-form-label" for="answer">Odpowiedź: </label>
                    <input :value="answer" autocomplete="off" class="answer-form-input" id="answer" ref="answer">
                </div>
                <div>
                    <label class="answer-form-label" for="answer-alt">Dodatkowe dane: </label>
                    <input :value="answerAlt" autocomplete="off" class="answer-form-input" id="answer-alt"
                           ref="answerAlt">
                </div>
                <Btn class="answer-form-button">Wyślij</Btn>
            </form>
        </div>
    </div>
</template>

<script>
  import { mapState } from 'vuex'
  import Btn from './Btn'
  import Logo from './Logo'

  export default {
    name: 'AnswerPage',
    components: {Logo, Btn},
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
          this.$toastr.e('Twoja odpowiedź jest za długa lub za krótka')
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
            padding: 2rem 0 0;
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
                width: 100%;
            }
        }
    }
</style>
