<template>
    <div ref="mapContainer" class="map"></div>
</template>

<script setup>
    import { ref, onMounted, watch } from 'vue'
    import L from 'leaflet'
    import 'leaflet/dist/leaflet.css'
    import parcoImg from '../assets/parco.png'

    const props = defineProps({
        parks: {
            type: Array,
            required: true
        }
    })

    const emit = defineEmits(['mapClick', 'popUpOpen', 'popUpClose'])

    // ------------

    var coordsTrento = [46.07, 11.12]
    var zoomMin = 13
    var zoomMax = 17

    //Bordi della mappa
    var boundsTrento = [
        [46.03, 11.08], //Angolo sud-ovest
        [46.115, 11.17]  //Angolo nord-est
    ]

    const mapContainer = ref(null)
    let mappa = null
    let markers = []

    //Creo la mappa con i bordi e limiti di zoom
    onMounted(async () => {
        if(!mapContainer.value) return

        mappa = L.map(mapContainer.value, {
            center: coordsTrento,
            zoom: zoomMin,
            minZoom: zoomMin,
            maxZoom: zoomMax,
            scrollWheelZoom: true,
            doubleClickZoom: true,
            boxZoom: true,
            keyboard: true,
            touchZoom: true,
            maxBounds: boundsTrento,
            maxBoundsViscosity: 1.0 //Impostato a 1 vuol dire che mi blocca al bordo
        });

        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',{ attribution: '&copy; OpenStreetMap &copy; CARTO' }).addTo(mappa);

        //Disabilito lo spostamento quando non sono zoommato perche' altrimenti "rimbalza"
        function limitaSpostamento() {
            if(mappa.getZoom() === zoomMin) mappa.dragging.disable();
            else mappa.dragging.enable();
        }

        limitaSpostamento();
        mappa.on('zoomend', limitaSpostamento); //Ad ogni modifica dello zoom controllo se posso muovermi
    
        //Restituisco le coordinate quando clicco sulla mappa
        mappa.on('click', (e) => {
            emit('mapClick', { lat: e.latlng.lat, lng: e.latlng.lng })
        })
    })

    // ------------

    //Aggiungo i marker per ogni parco, al centro delle sue coordinate

    function getCentro(coords){
        let sumLat = 0
        let sumLng = 0
        let count = 0

        coords.coordinates.forEach(poligono => {
            poligono.forEach(anello => {
                anello.forEach(([lng, lat]) => {
                    sumLat += lat
                    sumLng += lng
                    count++
                })
            })
        })

        return [sumLat/count, sumLng/count]
    }

    //Quando ricevo nuovi parchi (dalla view) li mostro sulla mappa
    watch(() => props.parks, (newParks) => {
        if(!mappa || !Array.isArray(newParks)) return

        markers.forEach(marker => marker.remove())
        markers = []

        const parkIcon = L.icon({
            iconUrl: parcoImg,
            iconSize: [35,35]
        })

        newParks.forEach(park => {
            if(!park.coords || !park.coords.coordinates) return

            //Info sul parco che vanno sul .bindpopup
            const parcoPopUp = `
                <div class="hud">
                    <h3>${ park.nome }</h3>

                    <div class="info">
                        <p>${ park.info }</p>
                    </div>
                </div>
            `

            const centro = getCentro(park.coords)
            const marker = L.marker(centro, { icon: parkIcon }).addTo(mappa).bindPopup(parcoPopUp, { autoClose: true, closeOnClick: true })

            marker.on('popupopen', () => { emit('popUpOpen', park._id) })
            marker.on('popupclose', () => { emit('popUpClose', park._id) })
            markers.push(marker)
        })
    },
    { immediate: true })
</script>

<style scoped>
    .map {
        width: 100%;
        height: 100%;
    }
</style>

<style>
    .hud {
        padding: 20px;
        width: 100%;
        max-width: 250px;
        text-align: center;
    }

    .info {
        display: block;
        align-items: center;
        margin-bottom: 10px;
    }
</style>