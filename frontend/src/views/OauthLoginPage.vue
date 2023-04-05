<template>
  <div id="app">
    <OauthLogin></OauthLogin>
  </div>
</template>

<script>
import OauthLogin from '../components/panel/OauthLogin'

export default {
  name: 'OauthLoginPage',
  components: {
    OauthLogin,
  },
}
</script>

<style scoped>
</style>
