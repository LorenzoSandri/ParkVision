const express = require('express');
const router = express.Router();

module.exports = (client) => {
    router.get('/', async(req, res) => {
        try{
            const db = client.db("parkvision_db");
            const parchiCollection = db.collection("parchi");
            const parchi = await parchiCollection.find({}).toArray();
            res.json(parchi);

        }catch(err){ res.status(500).json({ error: err.message }); }
    });

    return router;
}