import store from '@/store'
import AdminPanelPage from '@/views/AdminPanelPage.vue'
import AdminRoomPage from '@/views/AdminRoomPage.vue'
import LobbyPage from '@/views/LobbyPage.vue'
import OauthLoginPage from '@/views/OauthLoginPage.vue'
import RoomQrCodePage from '@/views/RoomQrCodePage.vue'
import ScorePage from '@/views/ScorePage.vue'
import TeamPage from '@/views/TeamPage.vue'
import AdminPage from "@/views/AdminPage.vue";
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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
