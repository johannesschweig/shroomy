import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import FilterPage from '@/components/FilterPage.vue'
import MushroomDetail from '@/views/MushroomDetail.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: { keepAlive: true }
  },
  {
    path: '/filter',
    name: 'filter',
    component: FilterPage
  },
  {
    path: '/mushroom/:id',
    name: 'mushroom-detail',
    component: MushroomDetail,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
