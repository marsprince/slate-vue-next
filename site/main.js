import Vue from 'vue'
import app from './app'
import './index.css'
import {router} from './router'

new Vue({
  el: '#app',
  router,
  render: (h) => h(app)
})
