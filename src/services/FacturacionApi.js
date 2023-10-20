import axios from 'axios'
import { useUserStore } from '@/stores/user'

const url = 'https://www.selina-panama-lavu.app'
// const url = 'http://localhost:8080'

export async function getUserData() {
  const headers = obtenerAuthHeaders()
  const result = await axios.get(`${url}/user`, { headers })
  return result.data
}

export async function enviarFactura(payload) {
  const headers = obtenerAuthHeaders()
  const result = await axios.post(`${url}/facturar`, payload, { headers })
  return result.data
}

export async function login(payload) {
  const result = await axios.post(`${url}/login`, payload)
  return result.data
}

export async function obtenerUltimoCierre() {
  const headers = obtenerAuthHeaders()
  const result = await axios.get(`${url}/fechaCierreDeDia`, { headers })
  return result.data
}

export async function logout() {
  // localStorage.clear()
}

function obtenerAuthHeaders() {
  const userStore = useUserStore()
  return { Authorization: `Bearer ${userStore.authToken}` }
}

function obtenerAuthToken() {
  const userStore = useUserStore()
  return userStore.authToken
}

// Store active EventSources to be able to close them if needed
const eventSources = {}

export function initializeSSE(messageHandler, errorHandler) {
  const endpoint = 'facturarCierreDeDia'
  if (eventSources[endpoint]) {
    console.warn("An SSE for this endpoint is already running. It's recommended to close it before opening a new one.")
    closeSSE(endpoint)
  }

  const sseUrl = `${url}/${endpoint}`

  const eventSource = new EventSource(`${url}/${endpoint}?token=${obtenerAuthToken()}`)

  // Handle incoming messages
  eventSource.onmessage = event => {
    const data = JSON.parse(event.data)
    messageHandler(data)
  }

  // Handle any SSE errors
  eventSource.onerror = error => {
    if (eventSource.readyState === EventSource.CONNECTING && errorHandler) {
      errorHandler(error)
    }
    closeSSE(endpoint)
  }

  eventSources[endpoint] = eventSource
}

export function closeSSE(endpoint) {
  if (eventSources[endpoint]) {
    eventSources[endpoint].close()
    delete eventSources[endpoint]
  }
}
