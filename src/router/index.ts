import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import FilterPage from '@/components/FilterPage.vue'
import MushroomDetail from '@/views/MushroomDetail.vue'
import Disclaimer from '@/views/Disclaimer.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/filter',
    name: 'filter',
    component: FilterPage,
  },
  {
    path: '/mushroom/:id',
    component: MushroomDetail,
    props: true
  },
  {
    path: '/disclaimer',
    name: 'disclaimer',
    component: Disclaimer
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // Only scroll to top when navigating to MushroomDetail
    if (to.name === 'MushroomDetail') {
      return { top: 0 }
    }
    // Default behavior (e.g., use browser back button)
    return savedPosition || { top: 0 }
  }
})

export default router
