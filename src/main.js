import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
// PrimeVue plugin
import PrimeVue from 'primevue/config'
import StyleClass from 'primevue/styleclass'
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'
import 'primevue/resources/themes/lara-light-teal/theme.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())

app.use(PrimeVue)
app.use(ToastService)
app.use(ConfirmationService)

app.use(router)

app.directive('styleclass', StyleClass)

app.mount('#app')
