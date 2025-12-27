<template>
  <div id="app">
    <!-- Questo componente di Vue fa apparire la pagina corrispondente all'indirizzo URL -->
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
/* Qui si possono mettere stili globali  */
body { margin: 0; font-family: sans-serif; }
</style>