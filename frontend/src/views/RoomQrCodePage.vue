<template>
  <div class="center">
    <div class="image-wrapper">
      <QRcode :url="url"></QRcode>
    </div>
  </div>
</template>

<script>
import QRcode from '@/components/QRcode'

export default {
  name: 'RoomQrCodePage',
  components: {QRcode},
  props: ['room'],
  computed: {
    url () {
      return 'https://' + window.location.host + this.$router.resolve({
        name: 'TeamPage',
        params: {'room': this.room}
      }).href
    }
  }
}
</script>

<style scoped>
.center {
  margin-top: 5rem;
  display: flex;
  justify-content: center;
}
.image-wrapper {
  width: 360px;
  display: block;
}
</style>