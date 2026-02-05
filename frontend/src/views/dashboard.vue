<template>
  <div class="dashboard">

    <div class="map">
      <Map :parks="parchiFiltrati" @mapClick="handleMapClick" @popUpOpen="addPopUpFilter" @popUpClose="removePopUpFilter"/>
    </div>


    <div class="info">
      <ButtonVue class="logoutBtn" @click="logout">Logout</ButtonVue>
 
      <!-- Tab di selezione -->
      <div class="tabs">
        <button
          v-for="tab in tabs" :key="tab" :class="{ active: activeTab === tab }" @click="activeTab = tab">
          {{ tab }}

          <ButtonVue v-if="tab === activeTab" @click="openFiltri">Filtri</ButtonVue>
        </button>
      </div>


      <!-- Liste con i dati -->
      <div class="lista">
        <ListaItem
          v-if="activeTab === 'Parchi'"
          :items="parchiFiltrati"
          :headers="headersParchi"
          :mapItem="mapParco"
          :showCreate="true"
          @select="handleItemHUD"
          @create="handleCreateHUD('parco')"
        />

        <ListaItem
          v-if="activeTab === 'Segnalazioni'"
          :items="segnalazioniFiltrate"
          :headers="headersSegnalazioni"
          :mapItem="mapSegnalazione"
          @select="risolviSegnalazione"
        />

        <ListaItem
          v-if="activeTab === 'Interventi'"
          :items="interventiFiltrati"
          :headers="headersInterventi"
          :mapItem="mapIntervento"
          :showCreate="true"
          @create="handleCreateHUD('intervento')"
          @select="handleItemHUD"
        />

      </div>
    </div>

    <ItemHUD
      v-if="itemHUDopen" 
      @close="itemHUDopen = false"
      :tipo="activeTab === 'Parchi' ? 'parco': 'intervento'"
      :item="itemSelezionato"
      :nomeParco="parchi.find(p => p._id === itemSelezionato?.parco_id)?.nome || ''"
      @delete="handleDeleteItem"
      @send="handleUpdateItem"/>
    
    <CreateHUD v-if="createOpen" @close="createOpen = false" :tipo="createTipo" :parchi="parchi" :zone="zone" :tipologie="tipologie" :coords="mapCoords" @send="handleCreate"/>
    
    <FiltriHUD
      v-if="filtriOpen"
      :tipo="activeTab.toLowerCase()"
      :modelValue="filtri[activeTab.toLowerCase()]"
      :zone="zone"
      :parchi="parchi"
      :responsabili="interventiAttivi.map(i => i.responsabile).filter((v,i,a) => a.indexOf(v)===i)"
      :tipologie="tipologie"
      @update:modelValue="val => filtri[activeTab.toLowerCase()] = val"
      @close="filtriOpen = false"
      ></FiltriHUD>

  </div>
</template>

<script setup>
  import { onMounted, ref, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import Map from '../components/map.vue'
  import { getAllParchi, createParco, updateParco, deleteParco } from '../services/parchiService.js'
  import { getAllSegnalazioni, updateSegnalazione } from '../services/segnalazioniService.js'
  import { getAllInterventi, createIntervento, updateIntervento, deleteIntervento } from '../services/interventiService.js'
  import ListaItem from '../components/dashboard/listaItems.vue'
  import ItemHUD from '../components/dashboard/itemHud.vue'
  import CreateHUD from '../components/dashboard/createHud.vue'
  import ButtonVue from '../components/button.vue'
  import FiltriHUD from '../components/dashboard/filtriHud.vue'

  const router = useRouter()





  // --------------

  //Gestione delle liste usando listaItems.vue che accetta una lista generica
  
  const tabs = ['Parchi', 'Segnalazioni', 'Interventi']
  const activeTab = ref('Parchi') //Imposto come default i parchi

  const headersParchi = ['Nome Parco', 'Numero di Segnalazioni', 'Numero di Interventi']
  const headersSegnalazioni = ['Nome Parco', 'Descrizione', 'Data']
  const headersInterventi = ['Nome Parco', 'Descrizione', 'Data']

  //Calcolo per ogni item i suoi valori
  function mapParco(parco){
    return [
      parco.nome,
      segnalazioniAttive.value.filter(s => s.parco_id === parco._id).length,
      interventiAttivi.value.filter(i => i.parco_id === parco._id).length
    ]
  }
  function mapSegnalazione(s){
    return [
      parchi.value.find(p => p._id === s.parco_id).nome,
      s.info,
      new Date(s.data).toLocaleDateString()
    ]
  }
  function mapIntervento(i){
    return [
      parchi.value.find(p => p._id === i.parco_id).nome,
      i.info,
      new Date(i.dataPrevista).toLocaleDateString()
    ]
  }








  // --------------

  //Carico i dati e applico i filtri (tolgo subito le segnalazioni risolte e gli interventi vecchi)

  const parchi = ref([])
  const segnalazioni = ref([])
  const interventi = ref([])

  onMounted(async () => { parchi.value = await getAllParchi() })
  onMounted(async () => { segnalazioni.value = await getAllSegnalazioni() })
  onMounted(async () => { interventi.value = await getAllInterventi() })

  //Filtro solo le segnalazioni e gli interventi attivi
  const segnalazioniAttive = computed( () => { return segnalazioni.value.filter(s => s.stato === false) })
  const interventiAttivi = computed( () => { return interventi.value.filter(i => new Date(i.dataPrevista) > new Date() )})



  const parchiFiltrati = computed(filtraParchi)
  const segnalazioniFiltrate = computed(filtraSegnalazioni)
  const interventiFiltrati = computed(filtraInterventi)



  function filtraParchi(){
    return parchi.value.filter(parco => {
      if(filtri.value.parchi.zona.length > 0 && !filtri.value.parchi.zona.includes(parco.zona)) return false

      if(filtri.value.parchi.segnalazioni && !segnalazioniAttive.value.some(s => s.parco_id === parco._id)) return false
    
      if(filtri.value.parchi.interventi && !interventiAttivi.value.some(i => i.parco_id === parco._id)) return false
    
      return true
    })
  }

  function filtraSegnalazioni(){
    return segnalazioniAttive.value.filter(s => {
      if(filtri.value.segnalazioni.parco_id.length > 0 && !filtri.value.segnalazioni.parco_id.includes(s.parco_id)) return false

      if(filtri.value.segnalazioni.zona.length > 0){
        const parco = parchi.value.find(p => p._id === s.parco_id)

        if(!parco || !filtri.value.segnalazioni.zona.includes(parco.zona)) return false
      }
      
      return true;
    })
  }

  function filtraInterventi(){
    return interventiAttivi.value.filter(i => {
      if(filtri.value.interventi.parco_id.length > 0 && !filtri.value.interventi.parco_id.includes(i.parco_id)) return false

      if(filtri.value.interventi.zona.length > 0){
        const parco = parchi.value.find(p => p._id === i.parco_id)

        if(!parco || !filtri.value.interventi.zona.includes(parco.zona)) return false
      }

      if(filtri.value.interventi.responsabile.length > 0 && !filtri.value.interventi.responsabile.includes(i.responsabile)) return false
      if(filtri.value.interventi.tipo.length > 0 && !filtri.value.interventi.tipo.includes(i.tipo)) return false

      return true
    })
  }

  // --------------

  //Apro la HUD dei filtri

  const zone=['Gardolo', 'Meano', 'Bondone', 'Sardagna', 'Ravina-Romagnano', 'Argentario', 'Povo', 'Mattarello', 'Villazano', 'Oltrefersina', 'San Giuseppe Santa Chiara', 'Centro Storico']
  const tipologie=['taglio erba', 'potatura', 'pulizia vialetti', 'controllo irrigazione', 'raccolta rifiuti', 'riparazione giochi', 'controllo recinzioni', 'ripristino illuminazione', 'verifica attrezzature sportive', 'trattamenti fitosanitari', 'ripristino prati', 'installazione attrezzature', 'eventi speciali', 'rimozione graffiti', 'raccolta rifiuti ingombranti', 'pulizia fontane']


  const filtri = ref({
    parchi: {
      zona: [],
      segnalazioni: false,
      interventi: false,
    },
    segnalazioni: {
      zona: [],
      parco_id: []
    },
    interventi: {
      zona: [],
      tipo: [],
      responsabile: [],
      parco_id: []
    }
  })

  const filtriOpen = ref(false)
  function openFiltri(){

    filtriOpen.value = true;
  }


  //Aggiungo e tolgo ai filtri il parco quando lo clicco sulla mappa
  function addPopUpFilter(parco_id){
    filtri.value['segnalazioni'].parco_id = [parco_id]
    filtri.value['interventi'].parco_id = [parco_id]
  }
  function removePopUpFilter(parco_id){
    filtri.value['segnalazioni'].parco_id = []
    filtri.value['interventi'].parco_id = []
  }





  // --------------

  //Gestione dei bottoni che aprono interfaccie (creazione robe nuove e altro)

  const itemHUDopen = ref(false)
  const createOpen = ref(false)
  const createTipo = ref('')
  const itemSelezionato = ref('')

  function handleItemHUD(item){
    itemSelezionato.value = item
    itemHUDopen.value = true
  }

  function handleCreateHUD(tipo){
    createTipo.value = tipo
    createOpen.value = true
  }

  //Leggo il click dalla mappa
  const mapCoords = ref({ lat: null, lng: null })

  function handleMapClick(coords){
    mapCoords.value = coords
  }


  //Logout
  function logout() {
      localStorage.removeItem('jwt')
      localStorage.removeItem('username')
      localStorage.removeItem('ruolo')

      router.push('/')
  }


  // --------------

  //Gestione delle API di creazione/update/cancellazione

  async function handleUpdateItem(dati){
    try {
      if(activeTab.value === 'Parchi'){
        await updateParco(itemSelezionato.value._id, dati)
        
        parchi.value = await getAllParchi()
      }else if(activeTab.value === 'Interventi'){
        await updateIntervento(itemSelezionato.value._id, {
          ...itemSelezionato.value,
          dataPrevista: dati.dataPrevista,
          rinnovo: dati.rinnovo
        })

        interventi.value = await getAllInterventi()
      }

      itemHUDopen.value = false
    } catch(err) { console.error(err) }
  }
  async function handleDeleteItem(){
    try {
      if(activeTab.value === 'Parchi'){
        await deleteParco(itemSelezionato.value._id)

        //Perchè cancellando un parco cancello anche tutte le segnalazioni/interventi associati
        parchi.value = await getAllParchi()
        segnalazioni.value = await getAllSegnalazioni()
        interventi.value = await getAllInterventi()
      }
      else if(activeTab.value = 'Interventi'){
        await deleteIntervento(itemSelezionato.value._id)

        interventi.value = await getAllInterventi()
      }

      itemHUDopen.value = false
    } catch(err) { console.error(err) }
  }
  async function handleCreate(dati){
    if(dati.tipo === 'parco'){
      try {
        const payload = {
          nome: dati.nome,
          info: dati.info,
          zona: dati.zona,
          //Lat e Lng sono invertite perchè il formato delle coordinate (sul DB) vuole cosi
          coords: {
            type: 'MultiPolygon',
            coordinates: [[[[dati.lng, dati.lat],[dati.lng, dati.lat],[dati.lng, dati.lat],[dati.lng, dati.lat]]]]} //Ripetuto 4 volte perchè MultiPolygon vuole cosi
        }

        await createParco(payload)

        createOpen.value = false
        parchi.value = await getAllParchi()

      } catch(err) { console.error(err) }
    }else if(dati.tipo === 'intervento'){
      try {
        const payload = {
          parco_id: dati.parco_id,
          dataPrevista: new Date(dati.data),
          tipo: dati.tipologia,
          info: dati.info,
          responsabile: dati.responsabile,
        }

        console.log(payload)
        await createIntervento(payload)

        createOpen.value = false
        interventi.value = await getAllInterventi()

      } catch(err) { console.error(err) }
    }
  }
  async function risolviSegnalazione(segnalazione){
    try {
      await updateSegnalazione(segnalazione._id, { ...segnalazione, stato: true })
      segnalazioni.value = await getAllSegnalazioni()
    } catch(err) { console.error(err) }
  }
</script>



<style scoped>
  .dashboard {
    display: flex;
    width: 100vw;
    height: 100vh;
  }

  .info {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .tabs {
    border-bottom: 1px solid #ddd;
  }
  .tabs button {
    padding: 10px 16px;
    border: none;
    background: none;
    cursor: pointer;
    font-weight: 500;
  }
  .tabs button.active {
    border-bottom: 2px solid #42b883;
    color: #42b883;
  }

  .map {
    flex: 2;
    height: 100%;
  }

  .lista {
    flex: 1;
    overflow-y: auto;
    min-height: 0;
  }

  .logoutBtn {
    position: absolute;
    top: 10px;
    right: 480px;
  }
</style>