import App from './App.vue'
import 'vue3-toastify/dist/index.css';
import router from './router'
import store from './store'
import t from "@/services/translator";
import {createApp} from "vue";

const app = createApp(App)

app.use(store)
app.use(router)
app.config.globalProperties.$t = t

app.mount('#app')
