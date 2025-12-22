const express = require('express');
const router = express.Router();

module.exports = (client) => {
    const db = client.db("parkvision_db"); // Usiamo lo stesso DB dei parchi
    const collection = db.collection("interventi");

    // Leggere tutti gli interventi dal DB
    router.get('/', async (req, res) => {
        try {
            const interventi = await collection.find({}).toArray();
            res.json(interventi);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    // Aggiungere un nuovo intervento 
    router.post('/nuovo', async (req, res) => {
        try {
            const nuovoIntervento = req.body; // Riceve i dati dal form Vue
            const result = await collection.insertOne(nuovoIntervento);
            res.status(201).json({ message: "Intervento salvato!", id: result.insertedId });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    return router;
}