<template>
  <img class="qr-code" :src="base64Url" alt="qr-code"/>
</template>

<script>
import QRCode from 'qrcode'

export default {
  name: 'QRcode',
  props: {
    url: {
      type: String,
      require: true,
    }
  },
  async created () {
    this.base64Url = await QRCode.toDataURL(this.url, {errorCorrectionLevel: 'H', version: 5})
  },
  data () {
    return {
      base64Url: '',
    }
  },
}
</script>

<style scoped>
.qr-code {
  width: 100%;
}
</style>
