const app = require('./backend/src/app.js');

require('dotenv').config(); //Dentro config() si può mettere il link a un .env
const { MongoClient } = require('mongodb');

const port = process.env.PORT || 8080;
const uri = process.env.MONGO_URI;


// Connessione a MongoDB Atlas
const client = new MongoClient(uri);

async function connectDB() {
  try {
    await client.connect();
    console.log("Connesso a MongoDB Atlas!");
  } catch (err) {
    console.error("Errore di connessione MongoDB:", err);
  }
}

// Chiamata alla connessione
connectDB();


//Avvio server
app.listen(port, () => {
  console.log(`Server avviato su http://localhost:${port}`);
});