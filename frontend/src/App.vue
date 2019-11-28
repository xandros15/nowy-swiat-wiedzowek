<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<script>
  export default {
    name: 'app',
  }
</script>

<style lang="scss">
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
    }

    #app, html, body {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
    }

    body {
        background: #b85f1b; /* fallback for old browsers */
        background: -webkit-linear-gradient(right, #b85f1b, #c2874d);
        background: -moz-linear-gradient(right, #b85f1b, #c2874d);
        background: -o-linear-gradient(right, #b85f1b, #c2874d);
        background: linear-gradient(to left, #b85f1b, #c2874d);
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
</style>
