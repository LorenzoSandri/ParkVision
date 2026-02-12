require('dotenv').config()
const mongoose = require('mongoose')
const app = require('./app')


const port = process.env.PORT || 3000
const DB = process.env.MONGO_URI


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
