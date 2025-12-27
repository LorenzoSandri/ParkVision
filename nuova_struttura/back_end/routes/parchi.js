const express = require('express');
const router = express.Router();

module.exports = (client) => {
    // Importiamo il controller dei parchi
    const parchiController = require('../controllers/parchi')(client);

    // Quando il browser chiede GET /API/parchi, eseguiamo la funzione del controller
    // Se nel tuo controller la funzione si chiama in modo diverso (es. getParchi), 
    // assicurati che il nome coincida.
    router.get('/', async (req, res) => {
        try {
            // Se il tuo controller è una funzione semplice che restituisce i dati:
            const db = client.db("parkvision_db");
            const parchi = await db.collection("parchi").find({}).toArray();
            res.json(parchi);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    return router;
};