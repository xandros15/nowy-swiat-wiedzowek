<script setup>
import {computed} from "vue";
import t from "@/services/translator";

const props = defineProps({
  type: String,
  payload: Object,
})

const formatted = computed(() => {
  switch (props.type) {
    case 'resetRoom':
      return t('HOST.HISTORY.RESET_ANSWERS');
    case 'resetScore':
      return t('HOST.HISTORY.RESET_SCORE');
    case 'resetSingle':
      return t('HOST.HISTORY.RESET_ANSWER', props.payload);
    case 'removeTiebreaker':
      return t('HOST.HISTORY.REMOVE_TIEBREAKER', props.payload);
    case 'addTiebreaker':
      return t('HOST.HISTORY.ADD_TIEBREAKER', props.payload);
    case 'removePoints':
      return t('HOST.HISTORY.REMOVE_POINTS', props.payload);
    case 'addPoints':
      return t('HOST.HISTORY.ADD_POINTS', props.payload);
    case 'putAnswer':
      return t('HOST.HISTORY.ANSWER', props.payload);
  }
})

</script>

<template>
  <td>
    {{ formatted }}
  </td>
</template>

<style scoped lang="scss">

</style>
