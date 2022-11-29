<template>
  <div>
    <h2 class="title">Odpowiedzi</h2>
    <div class="block" v-if="answers.length > 0">
      <div class="button-group">
        <Btn @click.native="reset" class="button">Resetuj Odpowiedzi</Btn>
      </div>
      <div class="mb-1 mt-1">
        <label class="clickable">Dodatkowo
          <input type="checkbox" v-model="columnsToShow" value="alt-answer"/>
        </label>
        <label class="clickable">Opcje
          <input type="checkbox" v-model="columnsToShow" value="options"/>
        </label>
        <label class="clickable">Ostatnio
          <input type="checkbox" v-model="columnsToShow" value="last-time"/>
        </label>
      </div>
      <BulkPoints/>
      <table class="table">
        <thead>
        <tr>
          <th>#</th>
          <th>Drużyna</th>
          <th v-if="columnsToShow.indexOf('last-time') !== -1">Ostatnio</th>
          <th>Odpowiedź</th>
          <th v-if="columnsToShow.indexOf('alt-answer') !== -1">Dodatkowo</th>
          <th v-if="columnsToShow.indexOf('options') !== -1">Opcje</th>
        </tr>
        </thead>
        <tbody>
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
            <button @click="resetSingle(answer.nickname)">Usuń</button>
            <button @click="pointAdd(answer.nickname)">+1 pkt</button>
            <button @click="pointRemove(answer.nickname)">-1 pkt</button>
            <button @click="tieAdd(answer.nickname)">+1 tie</button>
            <button @click="tieRemove(answer.nickname)">-1 tie</button>
          </td>
        </tr>
        </tbody>
      </table>
      <small>Możesz wybrać odpowiedzi do zbiorowych akcji</small>
    </div>
    <h3 class="title" v-else>Nie ma jeszcze odpowiedzi.</h3>
    <div class="block">
      <div class="block">
        <router-link :to="{name: 'ScorePage', params: {room}}" class="a" target="_blank">
          Otwórz punktacje w innej karcie
        </router-link>
      </div>
      <Score :isAdmin="true" class="flex-item"/>
      <div class="block-item">
        <Btn @click.native="scoreReset" class="button">Resetuj Punkty</Btn>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
import Btn from '@/components/Btn'
import BulkPoints from '@/components/BulkPoints'
import Score from '@/components/Score'

export default {
  name: 'AnswersPage',
  components: {Btn, BulkPoints, Score},
  data () {
    return {
      columnsToShow: [
        'alt-answer',
        'options',
      ]
    }
  },
  props: ['room'],
  computed: {
    ...mapState(['answers', 'selected', 'lastAnswers',]),
    lastAnswerOfNickname () {
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
  created () {
    this.$socket.emit('admin.room.join', {room: this.room})
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
      scoreReset: 'admin.score.reset',
    }),
    toggleSelect (nickname) {
      if (this.selected.indexOf(nickname) === -1) {
        this.selectAnswer(nickname)
      } else {
        this.unselectAnswer(nickname)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.clickable {
  cursor: pointer;
}

.tb-number {
  width: 5px
}

.mb-1 {
  margin-bottom: .3rem;
}

.mt-1 {
  margin-top: .3rem;
}

.title {
  color: #f2f2f2;
  text-shadow: 2px 2px 2px #020202;
  padding: .83em;
  margin: 0;
}

.tb-25 {
  width: 25%;
}

.a {
  text-decoration: none;
  color: #2c3e50;
  transition: color .3s;

  &:hover {
    color: #610d12;
  }
}

.block {
  display: flex;
  flex-direction: column;
  margin-bottom: .3rem;
  padding: 1rem;

  &-item {
    margin-bottom: .3rem;
  }
}

.table {
  color: #363636;
  background-color: #fff;
  margin: 0 .3rem;
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
}
</style>
