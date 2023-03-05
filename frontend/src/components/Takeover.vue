<template>
    <li>
        <b>{{ takeover.place }}. {{ takeover.name }}{{ time }}</b>
    </li>
</template>

<script>
  export default {
    name: 'takeover',
    props: {
      takeover: Object
    },
    computed: {
      time () {
        const {place, time} = this.takeover
        return place !== 1 ? ` (${time / 1000}s)` : ''
      }
    }
  }
</script>
