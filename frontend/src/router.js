import Vue from 'vue'
import VueRouter from 'vue-router'
import AdminPage from './views/AdminPage'
import TeamPage from './views/TeamPage'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'TeamPage',
      component: TeamPage,
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminPage,
    },
  ]
})

export default router