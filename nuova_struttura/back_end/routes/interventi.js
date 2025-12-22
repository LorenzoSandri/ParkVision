const express = require('express');
const router = express.Router();

// Esportiamo una funzione che riceve il "client" di MongoDB dal server.js
module.exports = (client) => {
    
    // Importiamo il controller degli interventi, passandogli il client del database
    const interventiController = require('../controllers/interventi')(client);

    /**
     * ROTTA: GET /API/interventi
     * SCOPO: Restituire al front-end la lista di tutti gli interventi nel DB
     */
    router.get('/', interventiController.getInterventi);

    /**
     * ROTTA: POST /API/interventi/nuovo
     * SCOPO: Ricevere dal front-end i dati di un nuovo intervento e salvarli
     */
    router.post('/nuovo', interventiController.salvaIntervento);

    // Restituiamo il router configurato al file server.js
    return router;
};