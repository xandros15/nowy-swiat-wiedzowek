import Vue from 'vue'
import VueToastr from 'vue-toastr'
import App from './App.vue'
import router from './router'
import socket from './services/socket-wrapper'
import store from './store'

Vue.config.productionTip = false

Vue.use(socket)
Vue.use(VueToastr)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
