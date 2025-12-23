import { createRouter, createWebHistory } from 'vue-router'
//import HomePage from '../components/HomeView.vue'
import AboutPage from '../components/AboutView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
//    component: HomePage
  },
  {
    path: '/about',
    name: 'about',
    component: AboutPage
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
