const Intervento = require('../models/intervento')


exports.getAllInterventi = async (req, res) => {
    try {
        const interventi = await Intervento.find()
        res.json(interventi)
    } catch(error){
        res.sendStatus(500)
    }
}

exports.getInterventoById = async (req, res) => {
    try {
        const intervento = await Intervento.findById(req.params.id)

        if(!intervento) return res.sendStatus(404)

        res.json(intervento)
    } catch(error){
        res.sendStatus(500)
    }
}

exports.updateIntervento = async (req, res) => {
    try {
        const intervento = await Intervento.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

        if(!intervento) return res.sendStatus(404)

        res.json(intervento)
    } catch(error){
        res.sendStatus(500)
    }
}

exports.createIntervento = async (req, res) => {
    try {
        const t = new Intervento(req.body)
        const intervento = await t.save()

        res.json(intervento)
    } catch(error){
        res.sendStatus(500)
    }
}

exports.deleteIntervento = async (req, res) => {
    try {
        await Intervento.findByIdAndDelete(req.params.id)

        res.sendStatus(204)
    } catch(error){
        res.sendStatus(500)
    }
}