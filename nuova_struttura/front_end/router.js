import { createRouter, createWebHistory } from 'vue-router';

// Qui definiamo l'elenco delle pagine disponibili nel sito
const routes = [
  {
    path: '/',               // Indirizzo base (Home)
    name: 'Home',
    component: () => import('./app.vue') // Per ora usiamo app.vue come pagina principale
  },
  {
    path: '/interventi',     // L'indirizzo della tua sezione
    name: 'GestioneInterventi',
    // Qui andrà il componente della tua dashboard (lo creeremo dopo)
    component: () => import('./app.vue') 
  }
];

const router = createRouter({
  history: createWebHistory(), // Gestisce la cronologia del browser in modo moderno
  routes                       // Applica la lista delle strade definita sopra
});

export default router; // Rendiamo il router disponibile per il file main.js