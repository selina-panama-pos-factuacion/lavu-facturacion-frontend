<template>
  <Dialog v-model="visible" @hide="onCancel">
    <template #header>
      Confirm Action
    </template>
    <template #footer>
      <Button label="Cancel" @click="onCancel" />
      <Button label="Confirm" @click="onConfirm" />
    </template>
    <p>{{ message }}</p>
  </Dialog>
</template>

<script setup>
import Button from 'primevue/button';
import Dialog from 'primevue/dialog'
import { ref } from 'vue'

const { modelValue } = defineProps(['modelValue'])
const { emit } = defineEmits(['update:modelValue', 'confirm', 'cancel'])

const visible = ref(false)
const message = ref('Are you sure you want to proceed?')

const onCancel = () => {
  visible.value = false
  emit('update:modelValue', false)
  emit('cancel')
}

const onConfirm = () => {
  visible.value = false
  emit('update:modelValue', false)
  emit('confirm')
}
</script>
