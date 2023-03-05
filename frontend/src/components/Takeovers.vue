<template>
    <div>
        <Btn class="button" @click.native="$store.dispatch('takeover.reset')">RESETUJ PRZEJĘCIA</Btn>
        <ul class="takeovers">
            <Takeover v-for="(takeover, i) in takeovers" :key="i" :takeover="takeover"/>
        </ul>
    </div>
</template>

<script>
  import { mapState } from 'vuex'
  import Takeover from './Takeover'
  import Btn from './Btn'

  export default {
    components: {Takeover, Btn},
    name: 'takeovers',
    computed: mapState({
      takeovers: state => state.takeovers,
    }),
  }
</script>

<style scoped>
    .takeovers {
        list-style: none;
        margin: 0;
        padding: 0;
    }
    .button {
        margin-bottom: 1rem;
    }
</style>
