const Segnalazione = require('../models/segnalazione')


exports.getAllSegnalazioni = async (req, res) => {
    try {
        const segnalazioni = await Segnalazione.find()
        res.json(segnalazioni)
    } catch(error){
        res.sendStatus(500)
    }
}

exports.getSegnalazioneById = async (req, res) => {
    try {
        const segnalazione = await Segnalazione.findById(req.params.id)

        if(!segnalazione) return res.sendStatus(404)

        res.json(segnalazione)
    } catch(error){
        res.sendStatus(500)
    }
}

exports.updateSegnalazione = async (req, res) => {
    try {
        const segnalazione = await Segnalazione.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

        if(!segnalazione) return res.sendStatus(404)

        res.json(segnalazione)
    } catch(error){
        res.sendStatus(500)
    }
}

exports.createSegnalazione = async (req, res) => {
    try {
        const t = new Segnalazione(req.body)
        const segnalazione = await t.save()

        res.json(segnalazione)
    } catch(error){
        res.sendStatus(500)
    }
}