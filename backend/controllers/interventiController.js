const Intervento = require('../models/intervento')


exports.getAllInterventi = async (req, res) => {
    try {
        const interventi = await Intervento.find()
        res.status(200).json(interventi)
    } catch(error){
        res.sendStatus(500)
    }
}

exports.updateIntervento = async (req, res) => {
    try {
        const intervento = await Intervento.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

        if(!intervento) return res.sendStatus(404)

        res.status(200).json(intervento)
    } catch(error){
        res.sendStatus(500)
    }
}

exports.createIntervento = async (req, res) => {
    try {
        const t = new Intervento(req.body)
        const intervento = await t.save()

        res.status(201).json(intervento)
    } catch(error){
        res.sendStatus(500)
    }
}

exports.deleteIntervento = async (req, res) => {
    try {
        const intervento = await Intervento.findByIdAndDelete(req.params.id)

        if(!intervento) return res.sendStatus(404)

        res.sendStatus(204)
    } catch(error){
        res.sendStatus(500)
    }
}