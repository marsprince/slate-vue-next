import './index.css'
import { createApp } from 'vue'
// @ts-ignore
import App from './app'
import {router} from './router'
const app = createApp(App)
app.use(router)
app.mount('#app')
