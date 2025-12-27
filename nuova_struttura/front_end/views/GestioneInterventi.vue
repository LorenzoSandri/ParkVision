<template>
  <div>
    <!-- Filtri (semplificati per chiarezza) -->
    <div id="filtri">
       <button class="dropdown-btn">Filtra Parchi</button>
    </div>

    <!-- Lista Parchi: Vue crea un div per ogni parco nell'array 'parchi' -->
    <div id="lista">
      <div v-for="parco in parchi" :key="parco._id" class="parco">
        <div class="info">
          <strong>{{ parco.nome }}</strong>
          <span>Stato: {{ parco.stato }}</span>
        </div>
        <!-- Cliccando il tasto, passiamo i dati del parco alla funzione -->
        <div class="btn_intervento" @click="preparaIntervento(parco)">+</div>
      </div>
    </div>

    <!-- HUD Creazione Intervento -->
    <div id="intervento_HUD" v-if="mostraHUD">
      <h3>Nuovo Intervento: {{ form.nomeParco }}</h3>
      <input type="date" v-model="form.data">
      <textarea v-model="form.note" placeholder="Note intervento"></textarea>
      <button @click="inviaAlDatabase">Conferma</button>
      <button @click="mostraHUD = false">Annulla</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      parchi: [],      // Lista parchi dal database
      mostraHUD: false, // Controllo visibilità finestra
      form: {          // Dati del nuovo intervento
        nomeParco: '',
        data: '',
        note: ''
      }
    }
  },
  mounted() {
    this.getParchi(); // Appena carichi la pagina, prendi i parchi
  },
  methods: {
    async getParchi() {
      const res = await fetch('/API/parchi');
      this.parchi = await res.json();
    },
    preparaIntervento(parco) {
      this.form.nomeParco = parco.nome;
      this.mostraHUD = true;
    },
    async inviaAlDatabase() {
      const res = await fetch('/API/interventi/nuovo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.form)
      });
      
      if(res.ok) {
        alert("Intervento salvato!");
        this.mostraHUD = false;
      }
    }
  }
}
</script>

<style scoped>
/* Importa il tuo CSS dalla cartella assets */
/* @ indica la cartella radice del progetto */
@import "@/assets/dashboard.css";

/* Qui puoi aggiungere piccole correzioni veloci solo per questo file */
#intervento_HUD { display: block; } /* Lo gestisce Vue con v-if, quindi deve essere block */
</style>