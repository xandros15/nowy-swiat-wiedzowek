import store from '@/store'
import AdminPanelPage from '@/views/AdminPanelPage'
import AdminRoomPage from '@/views/AdminRoomPage'
import LobbyPage from '@/views/LobbyPage'
import OauthLoginPage from '@/views/OauthLoginPage'
import RoomQrCodePage from '@/views/RoomQrCodePage'
import ScorePage from '@/views/ScorePage'
import TeamPage from '@/views/TeamPage'
import AdminPage from "@/views/AdminPage";
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/login',
      name: 'OauthLogin',
      component: OauthLoginPage,
    },
    {
      path: '/:room([\\w-_]{3,16})/admin',
      name: 'AdminPage',
      component: AdminPage,
      props: true,
    },
    {
      path: '/admin-panel',
      name: 'AdminPanel',
      component: AdminPanelPage,
    },
    {
      path: '/admin-panel/:room([\\w-_]{3,16})',
      name: 'AdminRoom',
      component: AdminRoomPage,
      props: true,
    },
    {
      path: '/',
      name: 'LobbyPage',
      component: LobbyPage,
    },
    {
      path: '/:room([\\w-_]{3,16})/score',
      name: 'ScorePage',
      component: ScorePage,
      props: true,
    },
    {
      path: '/:room([\\w-_]{3,16})',
      name: 'TeamPage',
      component: TeamPage,
      props: true,
    },
    {
      path: '/qr/:room([\\w-_]{3,16})',
      name: 'RoomQrCodePage',
      component: RoomQrCodePage,
      props: true,
    },
  ]
})

const adminRoutes = [
  'AdminPanel',
  'AdminRoom',
]

router.beforeEach((to, from, next) => {
  if (adminRoutes.indexOf(to.name) !== -1 && !store.state.isAdmin) {
    next({name: 'OauthLogin'})
    return
  }
  next()
})

export default router