<template>
  <router-link :to="{name: 'RoomQrCodePage', params: {room}}"
               style="display: inline-block;
               margin:auto;
               text-decoration: none"
               target="_blank">
    <div class="qr-link">
      <img class="qr-link-image" src="@/images/example-qr.png" alt="example-qr">
      <span class="qr-link-text">Wygeneruj kod QR do pokoju</span>
    </div>
  </router-link>
</template>

<script>
export default {
  name: "QR-link",
  props: ['room'],
}
</script>

<style lang="scss" scoped>
.qr-link {
  padding: .3rem;
  width: 300px;
  margin: auto;
  display: flex;
  align-items: center;
  background-color: #fff;
  border: 0 solid transparent;
  border-radius: .3rem;
  overflow: auto;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, .2), 0 5px 5px 0 rgba(0, 0, 0, .24);
  transform: scale(0.95);
  transition: transform .2s;

  &-text {
    color: black;
    font-weight: bold;
  }

  &-image {
    display: inline-block;
    width: 100px;
  }

  &:hover, &:focus {
    transform: scale(1);
  }
}
</style>