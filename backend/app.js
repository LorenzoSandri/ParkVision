const express = require('express')
const cors = require('cors')


const parchiRouter = require('./routes/parchi')
const segnalazioniRouter = require('./routes/segnalazioni')
const interventiRouter = require('./routes/interventi')
const authRouter = require('./routes/auth')

const app = express()

app.use(cors())
app.use(express.json())

// ----------------

//Invia le richieste /API/<nome>, al router giusto
app.use('/api/parchi', parchiRouter)
app.use('/api/segnalazioni', segnalazioniRouter)
app.use('/api/interventi', interventiRouter)
app.use('/api/auth', authRouter)

module.exports = app