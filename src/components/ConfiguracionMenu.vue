<template>
  <div>
    <Toast />
    <ConfirmDialog />
    <h1 class="mb-0">Configuración</h1>
    <Divider class="mt-0" />
    <div class="flex flex-column gap-4">
      <div class="flex flex-column gap-2">
        <label for="newPassword">Nueva contraseña</label>
        <InputText required id="newPassword" type="text" v-model="orderId" />
      </div>
    </div>
    <Button class="mt-5" label="GUARDAR" @click="confirmCambios" />
  </div>
</template>

<script setup>
import Button from 'primevue/button'
import ConfirmDialog from 'primevue/confirmdialog'
import Divider from 'primevue/divider'
import InputText from 'primevue/inputtext'
import Toast from 'primevue/toast'
import { ref } from 'vue'
import { useToast } from "primevue/usetoast"
import { useConfirm } from "primevue/useconfirm"

const confirm = useConfirm()
const toast = useToast()
const orderId = ref(null)

const showSucessToast = () => {
  toast.add({ severity: 'success', summary: 'Configuracion guardada', detail: 'Se guardaron los cambios con éxito', life: 3000 })
}

const confirmCambios = () => {
  const message = '¿Desea guardar los cambios?'
  confirm.require({
    message,
    header: 'Confirmación',
    icon: 'pi pi-exclamation-triangle',
    accept: showSucessToast,
    reject: () => { }
  })
}

</script>