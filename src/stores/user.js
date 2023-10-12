import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const isAuthenticated = ref(false)
  const authToken = ref('')
  const userObj = reactive({
    userId: '',
    nombre: '',
  })

  function logout() {
    isAuthenticated.value = false
    authToken.value = ''
    localStorage.clear()
  }

  function authenticate() {
    const token = localStorage.getItem('facturas-api-token')
    isAuthenticated.value = !!token
    authToken.value = token ? token : ''
  }

  function login({ userId, nombre, token }) {
    userObj.userId = userId
    userObj.nombre = nombre
    authToken.value = token
    localStorage.setItem('facturas-api-token', token)
  }

  function setUserData({ userId, nombre }) {
    userObj.userId = userId
    userObj.nombre = nombre
  }

  return { isAuthenticated, authToken, userObj, authenticate, logout, login, setUserData }
})
