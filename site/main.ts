import './index.css'
import { createApp } from 'vue'
import {compile} from '@vue/compiler-dom';
// @ts-ignore
import App from './app'
console.log(compile('<App v-slot:d="da"><div>{{da}}</div></App>').code);
import {router} from './router'
const app = createApp(App)
app.use(router)
app.mount('#app')
