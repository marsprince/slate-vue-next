import VueRouter from 'vue-router'
import Vue from 'vue'
Vue.use(VueRouter)

export const routes = [
  {
    path: '/plaintext',
    name: 'Plain Text',
    component: () => import('../pages/plaintext')
  },
  {
    path: '/',
    redirect: 'plaintext'
  },
]

export const router = new VueRouter({
  mode: 'hash',
  routes
})
