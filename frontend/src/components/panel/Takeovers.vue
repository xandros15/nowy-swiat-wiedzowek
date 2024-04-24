<template>
  <section class="card">
    <header class="card-header grid-2">
      <div class="left">
        <h2 class="clickable" @click="hidden = !hidden">{{ $t('HOST.TAKEOVER.TITLE') }}</h2>
      </div>
    </header>
    <table class="table card-body" v-if="!hidden">
      <thead>
      <tr>
        <th style="width: 15px">#</th>
        <th>{{ $t('HOST.TAKEOVER.TEAM_NAME') }}</th>
        <th :title="$t('HOST.TAKEOVER.TEAM_TIME_HINT')" style="cursor: pointer;">{{
            $t('HOST.TAKEOVER.TEAM_TIME')
          }}*
        </th>
      </tr>
      </thead>
      <tbody v-if="takeovers.length > 0">
      <tr v-for="takeover in takeovers" :key="takeover.name">
        <td>{{ takeover.place }}</td>
        <td>{{ takeover.name }}</td>
        <td>{{ takeover.place !== 1 ? `${takeover.time / 1000}s` : '-' }}</td>
      </tr>
      </tbody>
      <tbody v-else>
      <tr>
        <td class="empty" colspan="6">{{ $t('NO_TAKEOVERS') }}</td>
      </tr>
      </tbody>
    </table>
    <footer class="right" v-if="!hidden">
      <button class="button button-danger" @click="$store.dispatch('takeover.reset')">
        {{ $t('HOST.TAKEOVER.RESET') }}
      </button>
    </footer>
  </section>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'takeovers',
    data() {
      return {
        hidden: false,
      }
    },
    computed: mapState({
      takeovers: state => state.takeovers,
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
