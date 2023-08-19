<template>
    <div class="logo">
      <img alt="logo hikari" class="logo-image" src="../images/hikari.png">
    </div>
</template>

<script>
  export default {
    name: "Logo"
  }
</script>

<style lang="scss" scoped>
    .logo {
        padding-top: 1rem;

        &-image {
            max-width: 320px;
        }
    }
</style>