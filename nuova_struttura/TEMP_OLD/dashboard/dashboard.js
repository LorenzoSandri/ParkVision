// ==============================================
//Opzioni di filtraggio

//Apro il menu dei filtri per ogni bottone
document.addEventListener("DOMContentLoaded", () => {
    const dp = document.querySelectorAll(".dropdown");

    //Seleziono tutti i bottoni, poi ad ogniuno aggiungo che se lo clicco mostra il menu
    dp.forEach(dropdown => {
        const btn = dropdown.querySelector(".dropdown-btn");
        const menu = dropdown.querySelector(".dropdown-menu");

        btn.addEventListener("click", (e) => {
            e.stopPropagation();

            //Chiudo tutti i menu già aperti
            dp.forEach(d => { if(d !== dropdown) d.querySelector(".dropdown-menu").style.display = "none"; });

            //Mostro o tolgo il menu quando clicco il bottone
            menu.style.display = (menu.style.display === "block") ? "none" : "block";
        });

        //Questo evita che si chiude il menu cliccando la checkbox
        menu.addEventListener("click", (e) => { e.stopPropagation(); });
    });

    //Quando clicco fuori dal menu chiudo tutti i menu aperti
    document.addEventListener("click", () => {
        dp.forEach(d => {
            d.querySelector(".dropdown-menu").style.display = "none";
        });
    });
});



// ==============================================
//Lista dei parchi





//Salvo la finestra della creazione degli interventi, dato che è unica per tutti
const interventoHUD = document.getElementById("intervento_HUD");
const inputParco = document.getElementById("input_parco");



//Chiamo l'API per leggere i parchi dal DB
fetch('/API/parchi')
.then(res => res.json())
.then(data => {
    let parchi = data; // ora l’array contiene i dati

    const lista = document.getElementById("lista");

    //Creo l'HTML del parco e lo aggiungo alla lista
    parchi.forEach(p => {
    const li = document.createElement("li");
    li.className = "parco";

    li.innerHTML = `
        <div class="info">
            <div class="nome">${p.nome}</div>
            <div class="zona">Zona: ${p.zona}</div>
            <div class="stato">Stato intervento: ${p.stato}</div>
        </div>

        <div class="btn_intervento">&#9776;</div>
    `;

    lista.appendChild(li);
    });

    //Devo aggiungere lo script ad ogni bottone, però per chiuderlo basta l'ID, perchè c'è un unica finestra
    const btns = document.querySelectorAll(".btn_intervento");
    btns.forEach(btn => {
        btn.addEventListener("click", () => {
            //Aggiungo in automatico il nome del parco cliccato nel nuovo intervento
            inputParco.value = btn.closest(".parco").querySelector(".nome").textContent;

            interventoHUD.style.display = "block";
        });
    });
})
.catch(err => console.error(err));










// ==============================================
//Creazione nuovo intervento (copiato uguale dal login)



//Se premo "Conferma" devo controllare che tutti i dati sono stati inseriti, poi mando anche un messaggio di conferma del invio
//Sarà da aggiungere che invio pure i dati al DB per salvarli, e magari pure che si ricarica la pagina con l'intervento nuovo
document.getElementById("submit").onclick = () => {
    interventoHUD.style.display = "none";

    //Mostro il messaggio di conferma, poi lo elimino dopo 3 secondi
    const popup = document.getElementById("popup_salvataggio");
    popup.style.display = "block";

    setTimeout(() => { popup.style.display = "none"; }, 3000);
};

document.getElementById("intervento_close").onclick = () => { interventoHUD.style.display = "none"; };