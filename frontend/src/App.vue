<template>
    <div id="app" class="tsukimi">
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

        & .ryukon {
            --bg-color-1: #f5ad33;
            --bg-color-2: #eb7c6c;
            --button-color: #5f4c8b;
            --button-color-over: #32274f;
        }

        & .hikari {
            --bg-color-1: #672663;
            --bg-color-2: #fedc71;
            --button-color: #672663;
            --button-color-over: #8b3a87;
        }

        & .tsukimi {
          --bg-color-1: #2d336c;
          --bg-color-2: #fedc71;
          --button-color: #2d336c;
          --button-color-over: #454d9a
        }
    }

    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #000;
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
        background: linear-gradient(to bottom, var(--bg-color-1), var(--bg-color-2));
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
    .full-screen {
      width: 100%;
      height: 100%;
    }
    .button {
      display: inline-block;
      text-decoration: none;
      text-transform: uppercase;
      outline: 0;
      transition: background-color .3s;
      background: var(--button-color);
      border: 0 solid black;
      font-weight: 700;
      padding: 15px;
      color: #eee;
      font-size: 14px;
      cursor: pointer;

      &:hover, &:active, &:focus {
        background: var(--button-color-over);
      }

      &-danger {
        color: #eee;
        background: #9a0000;
        &:hover, &:active, &:focus {
          background: #cc0c0c;
        }
      }
    }
    .clickable {
      cursor: pointer;
    }
</style>
