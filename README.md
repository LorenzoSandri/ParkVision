AVVIO DEL SITO:
    -Apri la console
    -Vai sulla cartella 'backend' e scrivi: node server.js
    -Vai sulla cartella 'frontend' e scrivi: npm run dev
    -Il sito si trova sull'URL specificato dal frontend (http://localhost:5173/)


FRONTEND:
    -Components = Elementi usati in più pagine
    -Views = Pagine finali
    -Il router legge l'indirizzo "../dashboard" e passa a App.vue la view giusta, poi main.js caraica App.vue su index.html
        -Non toccare mai App.vue, main.js o index.html

    VIEWS:
        -Home.vue = pagina quando avvi il sito e non sei loggato
        -Public.vue = quando sei loggato con un account non amministratore (cittadini)
        -Dashboard.vue = quando sei loggato con un account amministratore (comune)

    COMPONENTS:
        -Button = un bottone semplice
        -Login/signUp = l'interfaccia (quella quadrata grigia) con tutti i campi e i bottoni
        -MAP = contiene tutto quello relativo alla mappa (Map.vue contiene la mappa e filtri.vue l'interfaccia per i filtri)
        -SegnalazioneMake = contiene l'interfaccia per fare le segnalazioni

    COME LAVORARCI:
        -Cose riusabili o sotto componenti di una pagina vanno in 'components'
        -Pagine finali vanno in 'views', cioè pagine che vengono caricate, con un '../<nome>' diverso
        -Se si crea una nuova views bisogna aggiungere il collegamento sul router (come quelli già presenti)


BACKEND:
    -Model = Struttura dei dati (deve rispettare quella del db)
    -Controllers = Definisce le API
    -Routes = Associa ad ogni URL '../api/servizio' il metodo giusto usando il controller
    -server.js = Associa ad ogni URL di alto livello la routes giusta
        -Non toccare mai altri file

    COME LAVORARCI:
        -Crea un nuovo model e una nuova collection sul db (il nome della collection non è a caso, scrivetemi se dovete farne una)
        -Nuovi controllers, routes e modifica al server.js come quelli già esistenti (basta cambiare fare ctrl+c, ctrl+v e cambiare tutti i nomi dell'oggetto: es. parco -> utente)
        -Nel frontend mettere un nuovo services, come il punto sopra
        -Nella view importi l'API e la usi (guarda come esempio il public.vue, guarda il 'GetAllParchi')

IL FRONTEND SI AGGIORNA IN AUTOMATICO SENZA FARE DI NUOVO npm run dev, IL BACKEND NO; DOVETE CHIUDERLO ctrl+c E RIAPRIRLO CON node server.js