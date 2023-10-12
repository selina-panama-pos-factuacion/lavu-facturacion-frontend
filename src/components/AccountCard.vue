<template>
  <div v-if="userStore.isAuthenticated" class="mr-5 w-13rem flex flex-column gap-2 text-center">
    <LoadingOverlay v-if="showLoadingOverlay" />
    <p>{{ userStore.userObj.nombre }}</p>
    <Button label="CERRAR SESIÓN" outlined severity="danger" @click="logout"/>
  </div>
</template>

<script setup>
import Button from "primevue/button"
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import { ref } from 'vue'
import { useUserStore } from '@/stores/user.js'
import { useRouter } from "vue-router"

const userStore = useUserStore()
const router = useRouter()

const showLoadingOverlay = ref(false)

const logout = () => {
  showLoadingOverlay.value = true
  userStore.logout()
  showLoadingOverlay.value = false
  router.push('/login')
}

</script>