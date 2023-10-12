<template>
  <main>
    <Toast />
    <LoadingOverlay v-if="showLoadingOverlay"/>
    <div class="login-container">
      <Card class="login-card">
        <template #title>Iniciar sesión</template>
        <template #content>
          <div class="p-fluid flex flex-column gap-3">
            <div class="p-field">
              <label for="email">Nombre de usuario</label>
              <InputText id="email" v-model="username" />
            </div>
            <div class="p-field">
              <label for="password">Contraseña</label>
              <Password id="password" v-model="password" :feedback="false" toggleMask />
            </div>
            <Button label="Login" @click="loginHandler" />
          </div>
        </template>
      </Card>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useToast } from "primevue/usetoast"
import { login } from '@/services/FacturacionApi.js'
import Button from 'primevue/button'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import Password from 'primevue/password'
import Toast from 'primevue/toast'

const router = useRouter()
const userStore = useUserStore()

const username = ref('')
const password = ref('')

const showLoadingOverlay = ref(false)

const loginHandler = async () => {  
  try {
    showLoadingOverlay.value = true
    const userData = await login( { username: username.value, password: password.value })
    userStore.login(userData)
    router.push('/')
  } catch (e) {
    if (e.response.status === 401) {
      showFailToast('Usuario y/o contraseña incorrecta.')
    } else {
      showFailToast(e.message)
    }
  } finally {
    showLoadingOverlay.value = false
  }
}
 
const toast = useToast()
const showFailToast = (message) => {
  toast.add({ severity: 'error', summary: 'Hubo un problema iniciando sesión', detail: message, life: 7000 })
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.login-card {
  max-width: 350px;
  width: 100%;
  padding: 1rem;
}
</style>
