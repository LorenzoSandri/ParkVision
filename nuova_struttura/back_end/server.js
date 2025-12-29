require('dotenv').config();
const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path'); // Serve per i percorsi delle cartelle

const app = express();
const port = 3000;
const DB = process.env.MONGO_URI;
const cors = require('cors');

// Questo permette al server di leggere i dati (JSON) che arrivano dai form del front-end
app.use(express.json());

app.use(cors());

//Middleware per gestire i file HTML e JS
//app.use(express.static(__dirname));

// Questo dice al server di andare a pescare i file nella cartella del front-end
//app.use(express.static(path.join(__dirname, '../front_end')));

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
const parchiAPI = require('./routes/parchi')(client);
app.use('/API/parchi', parchiAPI);

const interventiAPI = require('./routes/interventi')(client);
app.use('/API/interventi', interventiAPI);



// ----------------

// Gestione di Vue Router: se l'utente ricarica la pagina su /interventi,
// il server deve comunque mandargli l'index.html
//app.get(/.*/, (req, res) => {
//  res.sendFile(path.join(__dirname, '../front_end/index.html'));
//});

//Avvio il server
app.listen(port, () => {
  console.log(`Server avviato su http://localhost:${port}`);
});

