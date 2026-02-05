<template>
  <div class="public">
    <div class="map">
      <Map :parks="parchiFiltrati"/>
    </div>

    <div class="menu">
      <ButtonVue class="logoutBtn" @click="logout">Logout</ButtonVue>

      <div class="segnalazione">
        <ButtonVue @click="reportOpen = true">Crea Segnalazione</ButtonVue>
        <SegnalazioneHUD v-if="reportOpen" :utente="utenteLoggato" :parchi="parks" @send="invioSegnalazione" @close="reportOpen = false"/>
      </div>

      <div class="filtri">
        <Filtri :types="arrayFiltri" v-model="filtriAttivi"/>
      </div>

      
    </div>
  </div>
</template>

<script setup>
  import { onMounted, ref, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import Map from '../components/map.vue'
  import Filtri from '../components/filtri.vue'
  import { getAllParchi } from '../services/parchiService.js'
  import { createSegnalazione } from '../services/segnalazioniService.js'
  import SegnalazioneHUD from '../components/segnalazioneMake.vue'
  import ButtonVue from '../components/button.vue'

  const router = useRouter()
  const reportOpen = ref(false)
  const utenteLoggato = ref(localStorage.getItem('username') || '') //Prendo l'username della sessione


  // --------------
  
  //Array contenente i filtri, per aggiungerne di nuovi basta metterli qui
  const arrayFiltri = [
    { id: 1, name: 'Fontane', key: "fontane" },
    { id: 2, name: 'Accesso per disabili', key: "accessoDisabili" },
    { id: 3, name: 'Tavoli', key: "tavoli" },
    { id: 4, name: 'Percorsi fitness', key: "percorsiFitness" },
    { id: 5, name: 'Percorsi ciclabili', key: "percorsiCiclabili" },
    { id: 6, name: 'Aree giochi', key: "giochi" },
    { id: 7, name: 'Aree cani', key: "areaCani" },
    { id: 8, name: 'Panchine', key: "panchine" },
    { id: 9, name: 'Parcheggio', key: "parcheggio" },
    { id: 10, name: 'Servizi igenici', key: "servizi" },
    { id: 11, name: 'Illuminazione notturna', key: "illuminazione" },
    { id: 12, name: 'Campo da basket', key: "campoBasket" },
    { id: 13, name: 'Campo da calcio', key: "campoCalcio" },
    { id: 14, name: 'Campo da pallavolo', key: "campoPallavolo" },
  ]

  const filtriAttivi = ref([])
  const parks = ref([])

  //Carico i parchi dal DB
  onMounted(async () => {
    parks.value = await getAllParchi()
  })

  //Metto in parchiFiltrati solo i parchi che rispettano tutti i filtri attivi e li mando alla mappa
  const parchiFiltrati = computed( () => {
    if(filtriAttivi.value.length === 0) return parks.value;

    return parks.value.filter(parco => filtriAttivi.value.every(key => parco[key] === true))
  })

  // --------------

  //Invio della segnalazione al DB
  async function invioSegnalazione(segnalazione){
    const res = await createSegnalazione(segnalazione)

    if(!res) alert("Errore nell'invio")
    else reportOpen.value = false
  }


  //Logout
  function logout() {
    localStorage.removeItem('jwt')
    localStorage.removeItem('username')
    localStorage.removeItem('ruolo')

    router.push('/')
  }
</script>

<style scoped>
  .public {
    display: flex;
    width: 100vw;
    height: 100vh;
  }
  .map {
    flex: 2;
    height: 100%;
  }
  .menu {
    flex: 1;
    padding: 20px;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
  }
  .segnalazione {
    margin-bottom: 20px;
  }
  .logoutBtn {
    position: absolute;
    top: 20px;
    right: 20px;
  }
</style>