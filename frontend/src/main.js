import Vue from 'vue'
import VueSocketIO from 'vue-socket.io'
import VueToastr from 'vue-toastr'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

Vue.use(new VueSocketIO({
  debug: true,
  connection: process.env.NODE_ENV === 'development' ? 'http://192.168.0.61:3333' : '',
  vuex: {
    store,
    actionPrefix: 'socket.',
    mutationPrefix: 'socket.'
  },
}))

Vue.use(VueToastr)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
