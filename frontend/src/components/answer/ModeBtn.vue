<template>
  <button class="button">
    {{label}}
  </button>
</template>

<script>
export default {
  name: "ModeBtn",
  props: ['label'],
}
</script>

<style lang="scss" scoped>
.button {
  text-transform: uppercase;
  outline: 0;
  transition: background-color .3s;
  background: var(--button-color);
  border: 0;
  font-weight: 700;
  padding: 15px;
  color: #eee;
  font-size: 14px;
  cursor: pointer;

  &:hover, &:active, &:focus {
    background: var(--button-color-over);
  }
}
</style>