import './index.css'
import { createApp } from 'vue'
import { SlatePlugin } from 'slate-vue-next';
// @ts-ignore
import App from './app'
import {router} from './router'
const app = createApp(App)
app.use(router)
app.use(SlatePlugin)
app.mount('#app')
