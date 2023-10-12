import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
import FacturacionView from '@/views/FacturacionView.vue'
import ConfiguracionView from '@/views/ConfiguracionView.vue'
import LoginView from '@/views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: FacturacionView,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/configuracion',
      name: 'configuracion',
      component: ConfiguracionView,
      meta: {
        requiresAuth: true,
      },
    },
  ],
})

// route guard para autenticacion
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  userStore.authenticate()

  const { isAuthenticated } = userStore
  if (to.name === 'login' && isAuthenticated) {
    next('/')
  } else if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router
