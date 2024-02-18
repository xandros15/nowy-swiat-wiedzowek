<template>
  <div id="app">
    <LoginAdminPage :room="room" v-if="!isAdmin || !isLogged"/>
    <div v-else>
      <Answers class="block"/>
      <Takeovers class="block"/>
      <Score class="block" :room="room"/>
      <div class="block">
        <QRLink :room="room"/>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex';
import LoginAdminPage from '@/components/panel-legacy/LoginAdminPage';
import Score from "@/components/panel/Score";
import Answers from "@/components/panel/Answers";
import Takeovers from "@/components/panel/Takeovers";
import QRLink from "@/components/panel/QRLink";

export default {
  name: 'AdminPage',
  props: ['room'],
  components: {
    QRLink, Takeovers, Answers, Score,
    LoginAdminPage,
  },
  computed: mapState(['isLogged', 'isAdmin']),
}
</script>

<style scoped>
</style>
