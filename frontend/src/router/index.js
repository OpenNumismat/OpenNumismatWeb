import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
  },
  {
    path: '/open',
    name: 'open',
  },
  {
    path: '/about',
    name: 'about',
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
