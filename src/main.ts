import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import { translations } from './translation'

import App from './App.vue'
import router from './router'

const app = createApp(App)

const i18n = createI18n({
  locale: 'de',
  messages: {
    de: translations,
  },
})

app.use(i18n)
app.use(createPinia())
app.use(router)

app.mount('#app')
