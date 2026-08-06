<template>
  <section class="card">
    <header class="card-header grid-2">
      <div class="left">
        <h2 class="clickable" @click="hidden = !hidden">{{ $t('HOST.HISTORY.TITLE') }}</h2>
      </div>
    </header>
    <table class="table card-body" v-if="!hidden">
      <thead>
      <tr>
        <th>
          {{ $t('HOST.HISTORY.TIME') }}
        </th>
        <th>
          {{ $t('HOST.HISTORY.EVENT') }}
        </th>
      </tr>
      </thead>
      <tbody v-if="history.length > 0">
      <tr v-for="(record, idx) in history" :key="idx">
        <td>{{
            (new Date(record.timestamp)).toLocaleTimeString('pl-PL', {
              hour12: false,
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })
          }}
        </td>
        <HistoryRecord :type="record.type" :payload="record.data"/>
      </tr>
      </tbody>
      <tbody v-else>
      <tr>
        <td class="empty" colspan="6">{{ $t('NO_HISTORY') }}</td>
      </tr>
      </tbody>
    </table>
  </section>
</template>

<script>
import {mapState} from 'vuex'
import HistoryRecord from "@/components/panel/HistoryRecord.vue";

export default {
  name: 'history',
  components: {HistoryRecord},
  data() {
    return {
      hidden: true,
    }
  },
  computed: mapState({
    history: state => {
      const history = [...state.history]
      history.sort((a, b) => b.timestamp - a.timestamp)

      return history
    },
  }),
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
</style>
