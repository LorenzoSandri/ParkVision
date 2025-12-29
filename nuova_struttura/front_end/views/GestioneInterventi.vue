<template>
  <div class="gestione-interventi">
    <h2>Pianificazione Manutenzione Parchi</h2>

    <!-- Lista dei Parchi per scegliere dove fare l'intervento -->
    <div id="lista">
      <div v-for="parco in parchi" :key="parco._id" class="parco">
        <div class="info">
          <div class="nome"><strong>{{ parco.nome }}</strong></div>
          <div class="zona">Zona: {{ parco.zona }}</div>
          <div class="stato">Stato attuale: {{ parco.stato }}</div>
        </div>
        <!-- Il tuo bottone per aprire il modulo -->
        <div class="btn_intervento" title="Pianifica Intervento" @click="preparaIntervento(parco)">
          &#9776; Nuova Manutenzione
        </div>
      </div>
    </div>

    <!-- HUD Creazione Intervento (Appare solo quando clicchi il bottone) -->
    <div id="intervento_HUD" v-if="mostraHUD">
      <div class="hud-content">
        <h3>Nuovo Intervento per: {{ form.nomeParco }}</h3>
        
        <div class="campo">
          <label>Data dell'intervento:</label>
          <input type="date" v-model="form.data">
        </div>

        <div class="campo">
          <label>Descrizione lavori:</label>
          <input type="text" v-model="form.note" placeholder="es. Potatura alberi o pulizia">
        </div>

        <div class="azioni">
          <button class="btn-conferma" @click="inviaAlDatabase">Salva Intervento</button>
          <button class="btn-annulla" @click="mostraHUD = false">Annulla</button>
        </div>
      </div>
    </div>

    <!-- Messaggio di conferma finale -->
    <div id="popup_salvataggio" v-if="mostraSuccesso">
      Intervento salvato correttamente nel database!
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      parchi: [],          // Dati che arrivano da MongoDB
      mostraHUD: false,    // Gestisce l'apertura della finestra
      mostraSuccesso: false, // Gestisce il popup verde
      form: {              // I dati che invierai
        nomeParco: '',
        data: '',
        note: '',
        stato: 'Pianificato' // Stato di default dell'intervento
      }
    };
  },
  mounted() {
    this.getParchi(); // Carica i parchi appena apri la pagina
  },
  methods: {
    // 1. Legge i parchi dal database
    async getParchi() {
      try {
        const res = await fetch('/API/parchi');
        this.parchi = await res.json();
      } catch (err) {
        console.error("Errore nel caricamento parchi:", err);
      }
    },

    // 2. Prepara il form con il nome del parco cliccato
    preparaIntervento(parco) {
      this.form.nomeParco = parco.nome;
      this.mostraHUD = true;
    },

    // 3. Invia i dati al database (La parte più importante)
    async inviaAlDatabase() {
      try {
        const res = await fetch('/API/interventi/nuovo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.form)
        });

        if (res.ok) {
          this.mostraHUD = false; // Chiude la finestra
          this.mostraSuccesso = true; // Mostra il popup verde
          
          // Reset del form per il prossimo intervento
          this.form.data = '';
          this.form.note = '';

          // Nasconde il popup dopo 3 secondi
          setTimeout(() => { this.mostraSuccesso = false; }, 3000);
        }
      } catch (err) {
        alert("Errore durante il salvataggio!");
      }
    }
  }
};
</script>

<style scoped>
/* Importiamo il tuo stile originale dalla cartella assets */
@import "/assets/dashboard.css";

/* Piccola aggiunta per far funzionare bene Vue con il tuo HUD */
#intervento_HUD {
  display: flex; /* Sovrascrive il display:none del CSS se presente */
  justify-content: center;
  align-items: center;
}
.hud-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #ccc;
}
#popup_salvataggio {
  background-color: #4CAF50;
  color: white;
  padding: 15px;
  position: fixed;
  bottom: 20px;
  right: 20px;
  border-radius: 5px;
  z-index: 3000;
}
</style>