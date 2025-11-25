// ==============================================
//Gestione del menu con la sidebar

const menu_sidebar = document.getElementById('menu_sidebar');
const sidebar = document.getElementById('sidebar');

//Clicco sull'icona per mostrare la sidebar
menu_sidebar.onclick = function() {
    if(sidebar.style.width === '250px') sidebar.style.width = '0';
    else sidebar.style.width = '250px';
}


//Gestione della finestra di login
const loginHUD = document.getElementById("login_HUD");

document.getElementById("login_open").onclick = () => { loginHUD.style.display = "block"; };
document.getElementById("login_close").onclick = () => { loginHUD.style.display = "none"; };

//Redirect alla dashboard
document.getElementById("login_do").onclick = () => { window.location.href = "file:///C:/Users/Lorenzo/Desktop/parkvision/dashboard/index.html"; };
    /*
    Soluzione alternativa "on-page"
        Uso una variabile loggedIn = true;
        Dentro il pop-up metto if(loggedIn), cosi posso mostrare due dati diversi
        Per ricaricare la mappa chiamo una funzione "privateMap", che prende dal DB i dati degli alberi
        Qui metto la lettura delle credenziali dal DB
        Quando faccio il logout ricarico la pagina cosi tornano solo i parchi
    */



// ==============================================
//Opzioni di filtraggio

const filtriHUD = document.getElementById("filtri_HUD");

document.getElementById('menu_filtri').onclick = () => { filtriHUD.style.display = "block"; };
document.getElementById('filtri_close').onclick = () => { filtriHUD.style.display = "none"; };


    /*
      Quando leggo i parchi salvo in variabili diverse: privati, pubblici, grandi, medi, fontane, areaCani, etc.
      Poi uso addTo, removeFrom con la mappa per mostrare in modo dinamico
      Nel HTML do ad ogni filtro un id diverso, poi in JS salvo per ogni id una var boolean
      Se sono tutte false, mostro tutti i parchi
      Altrimenti mostro ogni parco true
    */



// ==============================================
//Impostazioni della mappa

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


// ==============================================
//Carico i parchi sulla mappa dal DB

//Da implementare, questo è un parco d'esempio


var parkCoords = [
    [46.0549, 11.1251],
    [46.0537, 11.1233],
    [46.0541, 11.1230],
    [46.0549, 11.1237],
    [46.0556, 11.1272],
    [46.0553, 11.1289],
    [46.0550, 11.1290]
];

//Crea in automatico un poligono con le coordinate
var giardino = L.polygon(parkCoords, {
    color: "#007a00",
    fillColor: "#00cc44",
    fillOpacity: 0.4
}).addTo(mappa);



//Ha senso o mostrare il rettangolo o solo l'icona, forse solo l'icona è più pulito e bello
/*

//Mostro l'icona
var parkIconBase = L.icon({
    iconUrl: 'grafica/icona.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40]
});

var markerParco = L.marker(giardino.getBounds().getCenter(), {
    icon: parkIconBase
}).addTo(mappa);

*/

//Posso metterci una qualunque roba html qua dentro
giardino.bindPopup(`
    <div class="popup-scheda">
        <h3>Giardino Alexander Langer</h3>
        <p><b>Area:</b> 1.2 ha</p>
        <p><b>Tipologia:</b> Parco urbano</p>
        <p><b>Apertura:</b> 08:00 - 20:00</p>
        <p><b>Note:</b> Bel parco, molto verde</p>
    </div>
`);