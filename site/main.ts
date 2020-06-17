import './index.css'
import { createApp } from 'vue'
import {compile} from '@vue/compiler-dom';
// @ts-ignore
import App from './app'
console.log(compile('<App class="active d" @delete="cl" d="ddd"><div>12</div></App>').code);
import {router} from './router'
const app = createApp(App)
app.use(router)
app.mount('#app')
