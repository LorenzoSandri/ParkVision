const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Utente = require('../models/utente')


exports.register = async (req, res) => {
    try {
        const { username, email, password, ruolo} = req.body

        if(!username || !email || !password) return res.sendStatus(400)

        //Controllo che l'utente non esista
        const utenteExists = await Utente.findOne({
            $or: [{ username }, { email }]
        })
        if(utenteExists) return res.sendStatus(409)

        //Calcolo l'hash della password
        const hashPsw = await bcrypt.hash(password, 10)


        const t = new Utente({
            username,
            email,
            password: hashPsw,
            ruolo: ruolo || 'utente'
        })
        const utente = await t.save()

        res.status(201).json(utente)
    } catch(error){
        res.sendStatus(500)
    }
}

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body

        if(!username || !password) return res.sendStatus(400)

        const utente = await Utente.findOne({ username })
        if(!utente) return res.sendStatus(401)

        const isPswValid = await bcrypt.compare(password, utente.password)
        if(!isPswValid) return res.sendStatus(401)

        
        //Genero il token
        const token = jwt.sign(
            { id: utente._id, username: utente.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        )
        
        res.status(200).json({ token, username: utente.username, ruolo: utente.ruolo })
    } catch(error){
        res.sendStatus(500)
    }
}