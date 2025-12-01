var coordsTrento = [46.07, 11.12];
var zoomMin = 13;
var zoomMax = 17;

//Bordi della mappa
var boundsTrento = [
    [46.03, 11.08], //Angolo sud-ovest
    [46.115, 11.17]  //Angolo nord-est
];

var mappa = L.map('mappa', {
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

//Carica tutte le tiles della mappa, uso questa perche' ha solo i nomi delle vie
L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',{ attribution: '&copy; OpenStreetMap &copy; CARTO' }).addTo(mappa);

//Disabilito lo spostamento quando non sono zoommato perche' altrimenti "rimbalza"
function limitaSpostamento() {
    if(mappa.getZoom() === zoomMin) mappa.dragging.disable();
    else mappa.dragging.enable();
}

limitaSpostamento();
mappa.on('zoomend', limitaSpostamento); //Ad ogni modifica dello zoom controllo se posso muovermi 