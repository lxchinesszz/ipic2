import { createRouter, createWebHashHistory } from 'vue-router'
import UploadPage from '../views/UploadPage.vue'

const routes = [
  {
    path: '/',
    name: 'uploadPage',
    component: UploadPage
  },
  {
    path: '/ballPage',
    name: 'ballPage',
    component: () => import('@/views/Ball')
  },
  {
    path: '/ballTimePage',
    name: 'ballTimePage',
    component: () => import('@/views/BallTime')
  },
  {
    path: '/userPreferences',
    name: 'UserPreferences',
    component: () => import('@/views/UserPreferences')
  }

]

const router = createRouter({
  mode: 'hash',
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

export default router
