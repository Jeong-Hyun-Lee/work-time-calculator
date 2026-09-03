import '@vuepic/vue-datepicker/dist/main.css'
import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import i18n from './i18n'
import { initAnalytics } from './analytics'

initAnalytics()

createApp(App).use(i18n).mount('#app')
