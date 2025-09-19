import { createApp, provide, h } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import { translations } from './translation'

import App from './App.vue'
import router from './router'
import { DefaultApolloClient } from '@vue/apollo-composable'
import { apolloClient } from './apollo'

const app = createApp({
  setup() {
    provide(DefaultApolloClient, apolloClient)
  },
  render: () => h(App)
})

const i18n = createI18n({
  legacy: false,
  locale: 'de',
  messages: {
    de: translations,
  },
})

app.use(i18n)
app.use(createPinia())
app.use(router)

app.mount('#app')
