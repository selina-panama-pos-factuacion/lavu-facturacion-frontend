<template>
  <div class="loadingOverlay">
    <ProgressSpinner />
  </div>
</template>

<script setup>
  import ProgressSpinner from 'primevue/progressspinner'
</script>

<style scoped>
  .loadingOverlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 99999;
  }
</style>
