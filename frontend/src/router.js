import Vue from 'vue'
import VueRouter from 'vue-router'
import AdminPage from './views/AdminPage'
import RoomsPage from './views/RoomsPage'
import TeamPage from './views/TeamPage'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'RoomPage',
      component: RoomsPage,
    },
    {
      path: '/:room(\\w{3,8})/admin',
      name: 'AdminPage',
      component: AdminPage,
      props: true,
    },
    {
      path: '/:room(\\w{3,8})',
      name: 'TeamPage',
      component: TeamPage,
      props: true,
    },
  ]
})

export default router