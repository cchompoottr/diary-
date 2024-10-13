import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import Vueform from '@vueform/vueform'
import vueformConfig from './../vueform.config'

const app = createApp(App)

// ใช้งาน Vueform พร้อมกับการตั้งค่า
app.use(Vueform, vueformConfig)

// ติดตั้งแอปใน #app
app.mount('#app')
