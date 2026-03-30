import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: { render: () => null },
  },
  {
    path: '/coin/:id',
    name: 'coin',
    component: { render: () => null },
  },
  {
    path: '/images/:id',
    name: 'images',
    component: { render: () => null },
  },
  {
    path: '/open',
    name: 'open',
    component: { render: () => null },
  },
  {
    path: '/settings',
    name: 'settings',
    component: { render: () => null },
  },
  {
    path: '/summary',
    name: 'summary',
    component: { render: () => null },
  },
  {
    path: '/about',
    name: 'about',
    component: { render: () => null },
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
