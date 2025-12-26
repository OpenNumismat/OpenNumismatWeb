import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
  },
  {
    path: '/coin/:id',
    name: 'coin',
  },
  {
    path: '/images/:id',
    name: 'images',
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
