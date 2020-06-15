import { createRouter, createWebHistory } from 'vue-router'

export const routes = [
  {
    path: '/plaintext',
    name: 'Plain Text',
    component: () => import('../pages/plaintext/index.vue')
  },
  {
    path: '/',
    redirect: 'plaintext'
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})
