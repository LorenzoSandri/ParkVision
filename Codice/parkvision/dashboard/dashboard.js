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









//Al posto di questa lista si mette l'API che li legge dal DB

const parchi = [
    { nome: "Parco Centrale", zona: "Centro Storico", stato: "Adeguato" },
    { nome: "Giardini Sardagna", zona: "Sardagna", stato: "Consigliato" },
    { nome: "Parco Bondone", zona: "Bondone", stato: "Necessario" },
    { nome: "Parco Mattarello", zona: "Mattarello", stato: "Adeguato" },
    { nome: "Parco Oltrefersina", zona: "Oltrefersina", stato: "Consigliato" },
    { nome: "Parco S.Giuseppe", zona: "S.Giuseppe-S.Chiara", stato: "Necessario" },
    { nome: "Parco Ravina", zona: "Ravina-Romagnano", stato: "Adeguato" },
    { nome: "Parco Argentario", zona: "Argentario", stato: "Consigliato" },
    { nome: "Parco Povo", zona: "Povo", stato: "Necessario" },
    { nome: "Parco Villazzano", zona: "Villazzano", stato: "Adeguato" },
    { nome: "Parco Meano", zona: "Meano", stato: "Consigliato" },
    { nome: "Parco Gardolo", zona: "Gardolo", stato: "Adeguato" },
];









//La parte qui sotto funziona quindi non bisogna toccarla (se non per modificare la grafica interna al parco sulla lista)


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




// ==============================================
//Creazione nuovo intervento (copiato uguale dal login)


//Gestione della finestra di creazione intervento
const interventoHUD = document.getElementById("intervento_HUD");
const inputParco = document.getElementById("input_parco");

//Devo aggiungere lo script ad ogni bottone, però per chiuderlo basta l'ID, perchè c'è un unica finestra
const btns = document.querySelectorAll(".btn_intervento");
btns.forEach(btn => {
    btn.addEventListener("click", () => {
        //Aggiungo in automatico il nome del parco cliccato nel nuovo intervento
        inputParco.value = btn.closest(".parco").querySelector(".nome").textContent;

        interventoHUD.style.display = "block";
    });
});


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