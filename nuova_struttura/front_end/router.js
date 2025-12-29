import { createRouter, createWebHistory } from 'vue-router';

// Qui definiamo l'elenco delle pagine disponibili nel sito
const routes = [
  {
    path: '/',               // Indirizzo base (Home)
    name: 'Home',
    component: () => import('./views/Home.vue') // Per ora usiamo app.vue come pagina principale
  },
   {
    path: '/interventi',
    name: 'GestioneInterventi',
    // Carichiamo il tuo file che si troverà nella cartella views
    component: () => import('./views/GestioneInterventi.vue')
  },
];

const router = createRouter({
  history: createWebHistory(), // Gestisce la cronologia del browser in modo moderno
  routes                       // Applica la lista delle strade definita sopra
});

export default router; // Rendiamo il router disponibile per il file main.js