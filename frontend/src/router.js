import Vue from 'vue'
import VueRouter from 'vue-router'
import AdminPage from './views/AdminPage'
import RoomsPage from './views/RoomsPage'
import ScorePage from './views/ScorePage'
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
      path: '/:room([\\w-]{2,18})/admin',
      name: 'AdminPage',
      component: AdminPage,
      props: true,
    },
    {
      path: '/:room([\\w-]{2,18})/score',
      name: 'ScorePage',
      component: ScorePage,
      props: true,
    },
    {
      path: '/:room([\\w-]{2,18})',
      name: 'TeamPage',
      component: TeamPage,
      props: true,
    },
  ]
})

export default router