<template>
  <div>
    <Toast />
    <ConfirmDialog>
      <template v-if="!esConfirmacionCierre" #message>
        <div class="flex flex-column gap-5 p-5">
          <h3 class="font-semibold">¿Está seguro que desea facturar la orden con los siguientes datos?</h3>
          <ul>
            <li>
              Orden de LAVU: <span class="font-semibold">{{ orderId }}</span>
            </li>
            <li>
              Orden cerrada: <span class="font-semibold">{{ orderClosed }}</span>
            </li>
            <li>
              Monto total: <span class="font-semibold">${{ orderTotal }}</span>
            </li>
            <div v-if="esContribuyente">
              <li>
                Tipo de contribuyente:
                <span class="font-semibold">{{ tipoContribuyenteLabel }}</span>
              </li>
              <div v-if="esExtranjero">
                <li>
                  Número de identificación: <span class="font-semibold">{{ numeroDocumento }}</span>
                </li>
                <li>
                  Nombre/Razón Social: <span class="font-semibold">{{ nombreRazonSocial }}</span>
                </li>
                <li>
                  País Extranjero: <span class="font-semibold">{{ paisSeleccionado.nombre }}</span>
                </li>
              </div>
              <div v-else>
                <li>
                  Tipo de RUC: <span class="font-semibold">{{ tipoRucLabel }}</span>
                </li>
                <li>
                  Número de identificación: <span class="font-semibold">{{ numeroDocumento }}</span>
                </li>
                <li>
                  Nombre/Razón Social: <span class="font-semibold">{{ nombreRazonSocial }}</span>
                </li>
                <li>
                  Dirección: <span class="font-semibold">{{ direccionCliente }}</span>
                </li>
              </div>
              <li>
                Email: <span class="font-semibold">{{ emailCliente }}</span>
              </li>
            </div>
          </ul>
        </div>
      </template>
    </ConfirmDialog>
    <Dialog
      @hide="cierreModalHidden"
      v-model:visible="cierreModalVisible"
      modal
      :closable="cierreModalClosable"
      header="CIERRE DE DÍA"
      :style="{ width: '50vw' }"
    >
      <h3 v-if="!resumenCierreVisible">Facturando cierre de día...</h3>
      <h3 v-else>¡Completado!</h3>
      <ProgressBar :value="cierreDeDiaResult.progress" class="my-4"></ProgressBar>
      <div v-if="hayErrorEnCierre">
        <h3>Hubo un error en el cierre de día!</h3>
        <h4>Contacte al administrador.</h4>
      </div>
      <div v-if="resumenCierreVisible">
        <h3 class="font-semibold">Resumen del cierre</h3>
        <ul>
          <li>
            Facturas exitosas: <span class="font-semibold">{{ cierreDeDiaResult.ordenesExito.count }}</span>
          </li>
          <li>
            Facturas fallidas: <span class="font-semibold">{{ cierreDeDiaResult.ordenesError.count }}</span>
            <ul v-if="cierreDeDiaResult.ordenesError.count > 0">
              <li v-for="orden in cierreDeDiaResult.ordenesError.ordenes">{{ orden }}</li>
            </ul>
          </li>
        </ul>
      </div>
    </Dialog>
    <LoadingOverlay v-if="showLoadingSpinner" />
    <h1 class="mb-0 mt-5">Facturar</h1>
    <Divider class="mt-0" />
    <div class="flex flex-column gap-4">
      <div class="flex flex-column gap-2">
        <label for="orderId">Orden de LAVU</label>
        <InputText required id="orderId" type="text" v-model="orderId" />
      </div>
      <div class="card flex justify-content-center">
        <span>Consumidor Final</span>
        <InputSwitch class="mx-2" v-model="esContribuyente" />
        <span>Contribuyente</span>
      </div>
      <Transition>
        <div v-if="esContribuyente">
          <h2 class="mb-2">Datos del cliente</h2>
          <div class="flex flex-column gap-4">
            <div class="flex flex-column gap-2">
              <label for="codigoTipoContribuyente">Tipo de contribuyente</label>
              <Dropdown
                id="codigoTipoContribuyente"
                v-model="codigoTipoContribuyente"
                :options="tiposContribuyente"
                optionLabel="descripcion"
                optionValue="codigo"
              />
            </div>
            <div v-if="!esExtranjero" class="flex flex-column gap-4">
              <div class="flex flex-column gap-2">
                <label for="tipoRuc">Tipo de RUC</label>
                <Dropdown id="tipoRuc" v-model="tipoRuc" :options="tiposRuc" optionLabel="descripcion" optionValue="codigo" />
              </div>
              <div class="flex flex-column gap-2">
                <label for="nombre">Nombre / Razón Social</label>
                <InputText id="nombre" type="text" v-model="nombreRazonSocial" />
              </div>
              <div class="flex flex-column gap-2">
                <label for="ruc">Número de identificación / RUC</label>
                <InputText id="ruc" type="text" v-model="numeroDocumento" />
              </div>
              <div class="flex flex-column gap-2">
                <label for="digitoVerificador">Dígito Verificador (DV)</label>
                <InputText id="digitoVerificador" type="text" v-model="digitoVerificador" />
              </div>
              <div class="flex flex-column gap-2">
                <label for="email">Email</label>
                <InputText id="email" type="text" v-model="emailCliente" />
              </div>
              <div class="flex flex-column gap-2">
                <label for="direccionCliente">Dirección</label>
                <InputText id="direccionCliente" type="text" v-model="direccionCliente" />
              </div>
            </div>
            <div v-else class="flex flex-column gap-4">
              <div class="flex flex-column gap-2">
                <label for="pais">País</label>
                <AutoComplete
                  v-model="paisSeleccionado"
                  :suggestions="paisesFiltrados"
                  @complete="searchCountry"
                  field="nombre"
                  forceSelection
                  :pt="{
                    input: { class: 'w-full' },
                  }"
                />
              </div>
              <div class="flex flex-column gap-2">
                <label for="nombre">Nombre - Razón Social</label>
                <InputText id="nombre" type="text" v-model="nombreRazonSocial" />
              </div>
              <div class="flex flex-column gap-2">
                <label for="ruc">Número de identidad</label>
                <InputText id="ruc" type="text" v-model="numeroDocumento" />
              </div>
              <div class="flex flex-column gap-2">
                <label for="email">Email</label>
                <InputText id="email" type="text" v-model="emailCliente" />
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
    <Button :disabled="!enableFacturarBtn" class="my-5" label="FACTURAR" @click="confirmFactura" />
    <Button class="mx-4 my-5" label="LIMPIAR DATOS" @click="limpiarCampos" />
    <Button v-if="false" class="my-5 mx-4" label="CIERRE DE DIA" @click="confirmCierreDeDia" />
  </div>
</template>

<script setup>
  import Button from 'primevue/button'
  import ConfirmDialog from 'primevue/confirmdialog'
  import Divider from 'primevue/divider'
  import Dropdown from 'primevue/dropdown'
  import InputSwitch from 'primevue/inputswitch'
  import Dialog from 'primevue/dialog'
  import ProgressBar from 'primevue/progressbar'
  import LoadingOverlay from '@/components/LoadingOverlay.vue'
  import InputText from 'primevue/inputtext'
  import AutoComplete from 'primevue/autocomplete'
  import Toast from 'primevue/toast'
  import { computed, onMounted, onUnmounted, ref } from 'vue'
  import { useUserStore } from '@/stores/user'
  import { useToast } from 'primevue/usetoast'
  import { useConfirm } from 'primevue/useconfirm'
  import { closeSSE, enviarFactura, getUserData, initializeSSE, obtenerUltimoCierre, getOrderData } from '@/services/FacturacionApi.js'
  import getUbicacionDeCodigo, { codigosPaises } from '@/consts/CodigosUbicacion.js'

  const tiposContribuyente = [
    {
      codigo: 1,
      descripcion: 'NACIONAL',
    },
    {
      codigo: 3,
      descripcion: 'GOBIERNO',
    },
    {
      codigo: 4,
      descripcion: 'EXTRANJERO',
    },
  ]

  const tiposRuc = [
    {
      codigo: 1,
      descripcion: 'NATURAL',
    },
    {
      codigo: 2,
      descripcion: 'JURÍDICO',
    },
  ]

  const userStore = useUserStore()
  const ultimoCierre = ref('')
  onMounted(async () => {
    const userData = await getUserData()
    userStore.setUserData({ userId: userData.id, nombre: userData.nombre })
  })

  // Form values
  const orderId = ref('')
  const orderClosed = ref('')
  const orderTotal = ref('')
  const esContribuyente = ref(false)
  const tipoRuc = ref(1)
  const codigoTipoContribuyente = ref(1)
  const nombreRazonSocial = ref('')
  const digitoVerificador = ref('')
  const numeroDocumento = ref('')
  const emailCliente = ref('')
  const codigoCorregimiento = ref(1)
  const codigoDistrito = ref(8)
  const codigoProvincia = ref(8)
  const direccionCliente = ref('')
  const paisSeleccionado = ref(null)
  const paisesFiltrados = ref([])

  const searchCountry = event => {
    let filtered = []
    for (let country of codigosPaises) {
      if (country.nombre.toLowerCase().includes(event.query.toLowerCase())) {
        filtered.push(country)
      }
    }
    paisesFiltrados.value = filtered
  }

  // Form manipulation
  const esExtranjero = computed(() => codigoTipoContribuyente.value === 4)
  const ubicacionObj = computed(() => {
    if (codigoCorregimiento.value !== 0 && codigoDistrito.value !== 0 && codigoProvincia.value !== 0) {
      return getUbicacionDeCodigo(`${codigoProvincia.value}-${codigoDistrito.value}-${codigoCorregimiento.value}`)
    } else {
      return null
    }
  })
  const labelUbicacion = computed(() => {
    if (ubicacionObj.value) {
      return `${ubicacionObj.value.provincia} - ${ubicacionObj.value.distrito} - ${ubicacionObj.value.corregimiento}`
    }
    return ''
  })
  const datosClienteCompletos = computed(() => {
    if (codigoTipoContribuyente.value !== 4) {
      return nombreRazonSocial.value && numeroDocumento.value && direccionCliente.value && emailCliente.value && digitoVerificador.value
    } else {
      return nombreRazonSocial.value && numeroDocumento.value && paisSeleccionado.value && emailCliente.value
    }
  })
  const enableFacturarBtn = computed(() => {
    if (orderId.value && !esContribuyente.value) {
      return true
    } else {
      return orderId.value && datosClienteCompletos.value
    }
  })

  // Toast messages
  const toast = useToast()

  const facturaExitosaToast = () => {
    toast.add({
      severity: 'success',
      summary: 'Factura emitida exitosamente',
      detail: `Factura para la orden ${orderId.value} enviada con éxito`,
    })
  }

  const showFailToast = response => {
    let detail = `Hubo un problema al facturar la orden ${orderId.value}. \n Revise que los datos estén correctos.`
    if (response.data && response.data.errors && response.data.errors.length > 0) {
      if (response.data.errors[0].startsWith('Ya se encuentra registrada una factura')) {
        detail = `La orden ${orderId.value} ya fue facturada previamente`
      }
    }
    toast.add({
      severity: 'error',
      summary: `Error al facturar orden ${orderId.value}`,
      detail,
    })
  }

  const showWarningToast = () => {
    let detail = `La DGI no ha confirmado la factura de la orden ${orderId.value}. \n Por favor confirme en GuruSoft más adelante.`

    toast.add({
      severity: 'warning',
      summary: `Falta confirmar la factura de la orden ${orderId.value}`,
      detail,
    })
  }

  // Confirmar factura
  const confirm = useConfirm()
  const tipoContribuyenteLabel = computed(() => {
    const { descripcion } = tiposContribuyente.find(contribuyente => {
      return contribuyente.codigo === codigoTipoContribuyente.value
    })
    return descripcion
  })
  const tipoRucLabel = computed(() => {
    const { descripcion } = tiposRuc.find(ruc => {
      return ruc.codigo === tipoRuc.value
    })
    return descripcion
  })

  const limpiarCampos = () => {
    orderId.value = ''
    orderClosed.value = ''
    orderTotal.value = ''
    esContribuyente.value = false
    codigoTipoContribuyente.value = 1
    nombreRazonSocial.value = ''
    digitoVerificador.value = ''
    numeroDocumento.value = ''
    emailCliente.value = ''
    tipoRuc.value = 1
    paisSeleccionado.value = ''
    codigoCorregimiento.value = 0
    codigoDistrito.value = 0
    codigoProvincia.value = 0
    direccionCliente.value = ''
  }

  const confirmFactura = async () => {
    try {
      const { cerrada, total } = await getOrderData(orderId.value)
      orderClosed.value = cerrada
      orderTotal.value = total
      confirm.require({
        header: 'Confirmación de factura',
        icon: 'pi pi-exclamation-triangle',
        accept: facturar,
        acceptLabel: 'Sí',
        reject: () => {},
      })
    } catch (error) {
      showFailToast(error)
    }
  }

  // Confirmar cierre de dia
  const esConfirmacionCierre = ref(false)
  const confirmCierreDeDia = async () => {
    ultimoCierre.value = await obtenerUltimoCierre()
    esConfirmacionCierre.value = true
    confirm.require({
      message: `¿Está seguro que desea facturar todas las órdenes desde el ${ultimoCierre.value.fecha} a las ${ultimoCierre.value.hora}? \n Esta acción no es reversible.`,
      header: 'Confirmación de cierre de día',
      icon: 'pi pi-exclamation-triangle',
      accept: cierreDeDia,
      acceptLabel: 'Sí',
      reject: () => {},
    })
  }

  // -- Interacciones con backend ---

  const showLoadingSpinner = ref(false)
  // Cierre de dia
  const cierreDeDiaResult = ref({})

  const cierreModalHidden = () => {
    cierreDeDiaResult.value = {}
    resumenCierreVisible.value = false
  }

  // Handler for the SSE data
  const handleMessage = async data => {
    cierreDeDiaResult.value = data
    if (cierreDeDiaResult.value.completed) {
      hayErrorEnCierre.value = false
      cierreModalClosable.value = true
      resumenCierreVisible.value = true
      esConfirmacionCierre.value = false
      limpiarCampos()
    }
  }

  const hayErrorEnCierre = ref(false)
  const handleError = error => {
    if (!cierreDeDiaResult.value.completed) {
      hayErrorEnCierre.value = true
      cierreModalClosable.value = true
    }
  }

  const iniciarCierreDeDia = () => {
    initializeSSE(handleMessage, handleError)
  }

  onUnmounted(() => {
    closeSSE('cierreDeDia')
  })

  const cierreModalVisible = ref(false)
  const cierreModalClosable = ref(false)
  const resumenCierreVisible = ref(false)

  const cierreDeDia = () => {
    try {
      hayErrorEnCierre.value = false
      cierreModalClosable.value = false
      cierreModalVisible.value = true
      iniciarCierreDeDia()
    } catch (e) {
      console.log('🚀 ~ file: FacturarForm.vue:391 ~ cierreDeDia ~ e:', e)
      showFailToast(e)
    }
  }

  // Facturacion

  const facturar = async () => {
    try {
      showLoadingSpinner.value = true
      const payload = {
        orderId: orderId.value.trim(),
        labelUbicacion: labelUbicacion.value.trim(),
        digitoVerificador: digitoVerificador.value.trim(),
        esContribuyente: esContribuyente.value,
        codigoTipoContribuyente: codigoTipoContribuyente.value,
        nombreRazonSocial: nombreRazonSocial.value.trim(),
        numeroDocumento: numeroDocumento.value.trim(),
        emailCliente: emailCliente.value.trim(),
        tipoRuc: tipoRuc.value,
        paisSeleccionado: paisSeleccionado.value,
        codigoCorregimiento: codigoCorregimiento.value,
        codigoDistrito: codigoDistrito.value,
        codigoProvincia: codigoProvincia.value,
        direccionCliente: direccionCliente.value.trim(),
      }
      const resultFactura = await enviarFactura(payload)
      if (resultFactura.Estado === '20') {
        showWarningToast()
      } else {
        facturaExitosaToast()
      }
      limpiarCampos()
    } catch (e) {
      showFailToast(e.response)
    } finally {
      showLoadingSpinner.value = false
    }
  }
</script>

<style>
  .v-enter-active,
  .v-leave-active {
    transition: opacity 0.5s ease;
  }

  .v-enter-from,
  .v-leave-to {
    opacity: 0;
  }
</style>
