require('dotenv').config();
const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;
const DB = process.env.MONGO_URI;

// Questo permette al server di leggere i dati (JSON) che arrivano dai form del front-end
app.use(express.json());

//Middleware per gestire i file HTML e JS
app.use(express.static(__dirname));

//Connessione al DB
const client = new MongoClient(DB);

//Stampo dei messaggi se sono riuscito o meno a connettermi al DB
async function connectDB(){
  try{
    await client.connect();
    console.log("Connesso a MongoDB Atlas!");
  }catch(err){ console.error("Errore di connessione MongoDB:", err); }
}

//Apro la connessione al DB
connectDB();


// ----------------


//Importo le varie API 
const parchiAPI = require('./controllers/parchi')(client);
app.use('/API/parchi', parchiAPI);

const interventiAPI = require('./controllers/interventi')(client);
app.use('/API/interventi', interventiAPI);



// ----------------

//Avvio il server
app.listen(port, () => {
  console.log(`Server avviato su http://localhost:${port}`);
});
