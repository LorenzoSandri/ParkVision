import { createApp } from 'vue'; // Importiamo la funzione per creare l'app
import App from './app.vue';    // Importiamo il componente principale
import router from './router'; // Importiamo il file delle rotte che stiamo per scrivere

const app = createApp(App); // Creiamo l'istanza dell'applicazione

app.use(router); // Diciamo a Vue di usare il sistema di navigazione (router)

app.mount('#app'); // Agganciamo l'app al file index.html