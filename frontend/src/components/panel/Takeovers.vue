<template>
    <div>
        <h3 class="title">Przejęcia:</h3>
        <Btn class="button" @click.native="$store.dispatch('takeover.reset')">RESETUJ PRZEJĘCIA</Btn>
        <ul class="takeovers">
            <Takeover v-for="(takeover, i) in takeovers" :key="i" :takeover="takeover"/>
        </ul>
    </div>
</template>

<script>
  import { mapState } from 'vuex'
  import Takeover from './Takeover'
  import Btn from '../Btn'

  export default {
    components: {Takeover, Btn},
    name: 'takeovers',
    computed: mapState({
      takeovers: state => state.takeovers,
    }),
  }
</script>

<style lang="scss" scoped>

.title {
  color: #f2f2f2;
  text-shadow: 2px 2px 2px #020202;
  padding: .83em;
  margin: 0;
}

.takeovers {
  list-style: none;
  margin: 0;
  padding: 0;
}

.button {
  margin-bottom: 1rem;
}
</style>
