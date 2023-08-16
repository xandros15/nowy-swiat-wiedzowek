import Vue from 'vue'
import VueToastr from 'vue-toastr'
import App from './App.vue'
import router from './router'
import socket from './services/socket-wrapper'
import store from './store'
import t from "@/services/translator";

Vue.config.productionTip = false

Vue.use(socket)
Vue.use(VueToastr)
Vue.prototype.$t = t

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
