<template>
  <section class="card">
    <header class="card-header grid-2">
      <div class="left">
        <h2 class="clickable" @click="hidden = !hidden">{{$t('HOST.ANSWERSHEET.TITLE')}}</h2>
      </div>
      <div class="right" style="display: flex; align-items: center">
        <label class="clickable">{{$t('HOST.ANSWERSHEET.ALT_ANSWER')}}
          <input type="checkbox" v-model="columnsToShow" value="alt-answer"/>
        </label>
        <label class="clickable">{{$t('HOST.ANSWERSHEET.OPTIONS')}}
          <input type="checkbox" v-model="columnsToShow" value="options"/>
        </label>
        <label class="clickable">{{$t('HOST.ANSWERSHEET.LAST_ANSWER')}}
          <input type="checkbox" v-model="columnsToShow" value="last-time"/>
        </label>
      </div>
    </header>
    <table class="table card-body" v-if="!hidden">
      <thead>
      <tr>
        <th style="width: 15px">#</th>
        <th>{{$t('HOST.ANSWERSHEET.TEAM_NAME')}}</th>
        <th v-if="columnsToShow.indexOf('last-time') !== -1">{{$t('HOST.ANSWERSHEET.LAST_ANSWER')}}</th>
        <th>{{$t('HOST.ANSWERSHEET.ANSWER')}}</th>
        <th v-if="columnsToShow.indexOf('alt-answer') !== -1">{{$t('HOST.ANSWERSHEET.ALT_ANSWER')}}</th>
        <th v-if="columnsToShow.indexOf('options') !== -1" style="width: 245px">{{$t('HOST.ANSWERSHEET.OPTIONS')}}</th>
      </tr>
      </thead>
      <tbody v-if="answers.length > 0">
      <tr :class="{selected: selected.indexOf(answer.nickname) !== -1}" :key="k"
          v-for="(answer, k) in answers">
        <td class="tb-number">{{ k + 1 }}</td>
        <td @click.prevent="toggleSelect(answer.nickname)" class="clickable">{{ answer.nickname }}</td>
        <td @click.prevent="toggleSelect(answer.nickname)"
            class="clickable" v-if="columnsToShow.indexOf('last-time') !== -1">
          {{ lastAnswerOfNickname(answer.nickname) }}
        </td>
        <td @click.prevent="toggleSelect(answer.nickname)" class="clickable">{{ answer.answer }}</td>
        <td @click.prevent="toggleSelect(answer.nickname)" class="tb-25 clickable"
            v-if="columnsToShow.indexOf('alt-answer') !== -1">{{ answer.answerAlt }}
        </td>
        <td v-if="columnsToShow.indexOf('options') !== -1">
          <button @click="resetSingle(answer.nickname)">{{$t('HOST.ANSWERSHEET.DELETE')}}</button>
          <button @click="pointAdd(answer.nickname)">{{$t('HOST.SCORESHEET.ADD_POINT')}}</button>
          <button @click="pointRemove(answer.nickname)">{{$t('HOST.SCORESHEET.DEL_POINT')}}</button>
          <button @click="tieAdd(answer.nickname)">{{$t('HOST.SCORESHEET.ADD_TIEBREAKER')}}</button>
          <button @click="tieRemove(answer.nickname)">{{$t('HOST.SCORESHEET.DEL_TIEBREAKER')}}</button>
        </td>
      </tr>
      </tbody>
      <tbody v-else>
      <tr>
        <td class="empty" colspan="6">{{ $t('NO_ANSWERS') }}</td>
      </tr>
      </tbody>
    </table>
    <footer v-if="!hidden">
      <div class="grid-2" style="padding: .1rem .3rem;  text-align: left">
        <div>
          <small style="margin: .2rem">{{ $t('HOST.SCORE.BATCH_ACTION') }}</small>
          <div style="margin: .5rem .2rem; display: flex; gap: .2rem">
            <div>
              <label class="label" @click="select('points')">{{ $t('HOST.SCORE.POINT_LABEL') }}:</label>
              <input
                  style="max-width: 40px;"
                  ref="points"
                  type="number"
                  v-model.number="points"
              >
            </div>
            <div>
              <label class="label" @click="select('tiebreaker')">{{ $t('HOST.SCORE.TIEBREAKER_LABEL') }}:</label>
              <input
                  style="max-width: 40px;"
                  ref="tiebreaker"
                  type="number"
                  v-model.number="tiebreaker"
              >
            </div>
          </div>
        </div>
      </div>
      <div class="grid-2">
        <div class="left flex" style="display: flex; align-items: stretch">
          <button @click="submit" class="button">{{ $t('HOST.SCORE.SUBMIT') }}</button>
        </div>
        <div class="right" style="display: flex; align-items: stretch">
          <button @click="reset" class="button button-danger">{{ $t('HOST.ANSWERSHEET.RESET') }}</button>
        </div>
      </div>
    </footer>
  </section>
</template>

<script>
import {mapActions, mapMutations, mapState} from "vuex";


export default {
  name: "Answers",
  data() {
    return {
      hidden: false,
      columnsToShow: [
        'alt-answer',
        'options',
      ],
      points: 1,
      tiebreaker: 0,
    }
  },
  computed: {
    ...mapState(['answers', 'selected', 'lastAnswers',]),
    lastAnswerOfNickname() {
      return nickname => {
        for (const lastAnswer of this.lastAnswers) {
          if (lastAnswer.nickname === nickname) {
            return lastAnswer.answer
          }
        }
        return ''
      }
    },
  },
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
      t: 't',
    }),
    toggleSelect(nickname) {
      if (this.selected.indexOf(nickname) === -1) {
        this.selectAnswer(nickname)
      } else {
        this.unselectAnswer(nickname)
      }
    },
    select(ref) {
      this.$refs[ref].select()
    },
    submit() {
      this.$store.dispatch('admin.bulkpoints', {
        tiebreaker: this.tiebreaker,
        points: this.points,
      });
      this.tiebreaker = 0
      this.points = 1
    },
  }
}
</script>

<style lang="scss" scoped>
.left {
  text-align: left;
  justify-content: left;
}

.right {
  text-align: right;
  justify-content: right;
}

.card {
  color: #363636;
  background-color: #fff;
  margin: .3rem;
  border: 0 solid transparent;
  border-radius: .3rem;
  overflow: auto;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, .2), 0 5px 5px 0 rgba(0, 0, 0, .24);

  &-header {
    margin: 0 1rem;
  }
}

.grid-2 {
  display: grid;
  grid-template-columns: repeat(2, 50%);
}

.table {
  color: #363636;
  background-color: #fff;
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
  & td.empty {
    font-style: italic;
    text-align: center;
    color: #363636;
    background-color: #fafafa;
  }
}

.label {
  margin-right: .3rem;
  cursor: pointer;
  font-weight: bold;
}
</style>