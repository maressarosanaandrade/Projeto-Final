import { createRouter, createWebHistory } from 'vue-router' 

import HomeView from '../views/HomeView.vue'
import AuthView from '../views/AuthView.vue'
import DashboardView from '../views/DashboardView.vue'
import ManualView from '../views/ManualView.vue'
import AchievementsView from '../views/AchievementsView.vue'

const routes = [
  {
    path: '/',
    component: HomeView 
  },
  {
    path: '/auth',
    component: AuthView
  },
  {
    path: '/dashboard',
    component: DashboardView
  },
  { path: '/manual',
    component: ManualView
  },
  { path: '/conquistas',
    component: AchievementsView
  }
]

const router = createRouter({
  history: createWebHistory(), 
  routes
})

router.beforeEach((to, from, next) => {
  next()
})

export default router