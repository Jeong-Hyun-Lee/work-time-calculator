import '@vuepic/vue-datepicker/dist/main.css'
import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { initAnalytics } from './analytics'

initAnalytics()

createApp(App).mount('#app')
