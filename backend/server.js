require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const parchiRouter = require('./routes/parchi')
const segnalazioniRouter = require('./routes/segnalazioni')
const interventiRouter = require('./routes/interventi')
const authRouter = require('./routes/auth')

const app = express()
const port = 3000
const DB = process.env.MONGO_URI

app.use(cors())
app.use(express.json())

// ----------------

//Invia le richieste /API/<nome>, al router giusto
app.use('/api/parchi', parchiRouter)
app.use('/api/segnalazioni', segnalazioniRouter)
app.use('/api/interventi', interventiRouter)
app.use('/api/auth', authRouter)

// ----------------


//Connessione al DB
async function connectDB(){
  try{
    await mongoose.connect(DB);
    console.log("Connesso a MongoDB Atlas!");
  }catch(err){ console.error("Errore di connessione MongoDB:", err); }
}

//Apro la connessione al DB
connectDB();

//Avvio il server
app.listen(port, () => {
  console.log(`Server avviato su http://localhost:${port}`);
});