<template>
    <div class="animatsuri" id="app">
        <StatusBar/>
        <LogoutBar/>
        <router-view/>
    </div>
</template>

<script>
  import LogoutBar from './components/LogoutBar'
  import StatusBar from './components/StatusBar'

  export default {
    name: 'app',
    components: {LogoutBar, StatusBar},
  }
</script>

<style lang="scss">
    :root {
        --bg-color-1: #b85f1b;
        --bg-color-2: #c2874d;
        --button-color: #b84d08;
        --button-color-over: #d15208;

        & .animatsuri {
            --bg-color-1: #3b469f;
            --bg-color-2: #4edde8;
            --button-color: #2f3a73;
            --button-color-over: #576c9b;
        }
    }

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

    #app {
        box-sizing: border-box;
    }

    #app {
        overflow: auto;
        background: var(--bg-color-1); /* fallback for old browsers */
        background: -webkit-linear-gradient(right, var(--bg-color-1), var(--bg-color-2));
        background: -moz-linear-gradient(right, var(--bg-color-1), var(--bg-color-2));
        background: -o-linear-gradient(right, var(--bg-color-1), var(--bg-color-2));
        background: linear-gradient(to left, var(--bg-color-1), var(--bg-color-2));
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
</style>
