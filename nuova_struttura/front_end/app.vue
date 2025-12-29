<template>
  <div id="layout">
    <nav>
      <router-link to="/">Home</router-link> | 
      <router-link to="/interventi">Interventi</router-link>
    </nav>
    
    <!-- Qui verranno caricate le pagine Home.vue o GestioneInterventi.vue -->
    <router-view /> 
  </div>
</template>