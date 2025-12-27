module.exports = (client) => {
    const db = client.db("parkvision_db");
    const collection = db.collection("interventi");

    return {
        // Legge tutti gli interventi
        getInterventi: async (req, res) => {
            try {
                const interventi = await collection.find({}).toArray();
                res.json(interventi);
            } catch (err) {
                res.status(500).json({ error: err.message });
            }
        },
        // Salva un nuovo intervento
        salvaIntervento: async (req, res) => {
            try {
                const nuovo = req.body;
                // Aggiungiamo un timestamp di creazione
                nuovo.createdAt = new Date();
                const result = await collection.insertOne(nuovo);
                res.status(201).json({ message: "Intervento salvato!", id: result.insertedId });
            } catch (err) {
                res.status(500).json({ error: err.message });
            }
        }
    };
};